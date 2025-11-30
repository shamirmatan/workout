'use server';

import { db } from '@/lib/db';
import { config, completedWorkouts, workoutTemplates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { calculateCurrentWeek, getProgramStartDateForWeek } from '@/lib/week-calculator';
import { calculateWeight, LIFT_TO_ADJUSTMENT_KEY } from '@/lib/weight-calculator';
import type { ExerciseLog, TemplateExercise, MainLift, Config } from '@/types';

// Get app configuration with calculated current week
export async function getConfig() {
  const results = await db.select().from(config);
  if (results.length === 0) {
    // Insert default config if none exists
    await db.insert(config).values({ id: 'default' });
    return (await db.select().from(config))[0];
  }

  const configData = results[0];

  // Calculate current week dynamically based on program start date
  const calculatedWeek = calculateCurrentWeek(configData.programStartDate);

  return {
    ...configData,
    currentWeek: calculatedWeek,
  };
}

// Update configuration
export async function updateConfig(updates: Partial<typeof config.$inferInsert>) {
  await db.update(config).set(updates).where(eq(config.id, 'default'));
  revalidatePath('/');
  revalidatePath('/settings');
  revalidatePath('/workouts');
  revalidatePath('/progress');
}

// Set the program to a specific week (calculates and sets the start date)
export async function setCurrentWeek(weekNumber: number) {
  const startDate = getProgramStartDateForWeek(weekNumber);
  await db.update(config)
    .set({ programStartDate: startDate })
    .where(eq(config.id, 'default'));

  revalidatePath('/');
  revalidatePath('/settings');
  revalidatePath('/workouts');
  revalidatePath('/progress');
}

// Save completed workout
export async function saveWorkout(data: {
  weekNumber: number;
  phaseNumber: number;
  dayLabel: string;
  templateId: string;
  exerciseLogs: ExerciseLog[];
  notes?: string;
}) {
  const id = `week-${data.weekNumber}-day-${data.dayLabel}`;

  // Save the workout
  await db.insert(completedWorkouts).values({
    id,
    weekNumber: data.weekNumber,
    phaseNumber: data.phaseNumber,
    dayLabel: data.dayLabel,
    templateId: data.templateId,
    completedAt: new Date().toISOString(),
    exerciseLogsJson: JSON.stringify(data.exerciseLogs),
    notes: data.notes,
  }).onConflictDoUpdate({
    target: completedWorkouts.id,
    set: {
      exerciseLogsJson: JSON.stringify(data.exerciseLogs),
      completedAt: new Date().toISOString(),
      notes: data.notes,
    },
  });

  // Update weight adjustments based on actual lifted weights
  await updateWeightAdjustments(data.templateId, data.weekNumber, data.exerciseLogs);

  revalidatePath('/');
  revalidatePath('/workouts');
  revalidatePath(`/workouts/${data.weekNumber}/${data.dayLabel}`);
}

// Update weight adjustments based on what was actually lifted vs prescribed
async function updateWeightAdjustments(
  templateId: string,
  weekNumber: number,
  exerciseLogs: ExerciseLog[]
) {
  // Get the template to find mainLift for each exercise
  const templateResults = await db.select().from(workoutTemplates).where(eq(workoutTemplates.id, templateId));
  if (templateResults.length === 0) return;

  const template = templateResults[0];
  const exercises: TemplateExercise[] = JSON.parse(template.exercisesJson);

  // Get current config
  const configData = await getConfig();

  // Build config object with proper types
  const configTyped: Config = {
    id: configData.id ?? 'default',
    programStartDate: configData.programStartDate,
    startingSquat: configData.startingSquat,
    startingBench: configData.startingBench,
    startingDeadlift: configData.startingDeadlift,
    startingRdl: configData.startingRdl,
    startingOhp: configData.startingOhp,
    weeklyIncrement: configData.weeklyIncrement,
    deloadPercentage: configData.deloadPercentage,
    currentWeek: configData.currentWeek,
    squatAdjustment: configData.squatAdjustment ?? 0,
    benchAdjustment: configData.benchAdjustment ?? 0,
    deadliftAdjustment: configData.deadliftAdjustment ?? 0,
    rdlAdjustment: configData.rdlAdjustment ?? 0,
    ohpAdjustment: configData.ohpAdjustment ?? 0,
  };

  // Track adjustments to update
  const adjustmentUpdates: Partial<Record<MainLift, number>> = {};

  for (const exercise of exercises) {
    // Only process exercises with a mainLift and percentageOfMain = 1 (main compound lifts)
    if (!exercise.mainLift || (exercise.percentageOfMain && exercise.percentageOfMain !== 1)) {
      continue;
    }

    // Find the corresponding exercise log
    const log = exerciseLogs.find(l => l.exerciseId === exercise.id);
    if (!log || log.sets.length === 0) continue;

    // Find max weight lifted across all completed sets
    const completedSets = log.sets.filter(s => s.completed);
    if (completedSets.length === 0) continue;

    const maxLiftedWeight = Math.max(...completedSets.map(s => s.weight));

    // Calculate what was prescribed (includes current adjustment)
    const prescribedWeight = calculateWeight(
      exercise.mainLift,
      weekNumber,
      configTyped,
      1
    );

    // If they lifted different weight, calculate new adjustment
    const difference = maxLiftedWeight - prescribedWeight;
    if (Math.abs(difference) >= 2.5) { // Only adjust if difference is at least 2.5kg
      const currentAdjustment = configTyped[LIFT_TO_ADJUSTMENT_KEY[exercise.mainLift]] as number;
      adjustmentUpdates[exercise.mainLift] = currentAdjustment + difference;
    }
  }

  // Update config with new adjustments
  if (Object.keys(adjustmentUpdates).length > 0) {
    const updates: Record<string, number> = {};
    for (const [lift, adjustment] of Object.entries(adjustmentUpdates)) {
      const key = LIFT_TO_ADJUSTMENT_KEY[lift as MainLift];
      updates[key] = adjustment;
    }
    await db.update(config).set(updates).where(eq(config.id, 'default'));
  }
}

// Get all completed workouts
export async function getCompletedWorkouts() {
  return db.select().from(completedWorkouts);
}

// Get specific completed workout
export async function getCompletedWorkout(weekNumber: number, dayLabel: string) {
  const id = `week-${weekNumber}-day-${dayLabel}`;
  const results = await db.select().from(completedWorkouts).where(eq(completedWorkouts.id, id));
  return results[0] || null;
}

// Delete a completed workout (reset)
export async function deleteWorkout(weekNumber: number, dayLabel: string) {
  const id = `week-${weekNumber}-day-${dayLabel}`;
  await db.delete(completedWorkouts).where(eq(completedWorkouts.id, id));

  revalidatePath('/');
  revalidatePath('/workouts');
  revalidatePath(`/workouts/${weekNumber}/${dayLabel}`);
}

// Update workout template
export async function updateTemplate(id: string, exercisesJson: string) {
  await db.update(workoutTemplates)
    .set({ exercisesJson })
    .where(eq(workoutTemplates.id, id));
  revalidatePath('/templates');
  revalidatePath('/workouts');
}

// Get all templates
export async function getTemplates() {
  return db.select().from(workoutTemplates);
}

// Seed database with initial data
export async function seedDatabase() {
  const { ALL_TEMPLATES } = await import('@/lib/program-data');

  // Insert default config if none exists
  await db.insert(config).values({ id: 'default' }).onConflictDoNothing();

  // Insert all templates
  for (const template of ALL_TEMPLATES) {
    await db.insert(workoutTemplates).values({
      id: template.id,
      phaseNumber: template.phaseNumber,
      dayLabel: template.dayLabel,
      name: template.name,
      exercisesJson: JSON.stringify(template.exercises),
    }).onConflictDoUpdate({
      target: workoutTemplates.id,
      set: {
        name: template.name,
        exercisesJson: JSON.stringify(template.exercises),
      },
    });
  }

  revalidatePath('/');
}
