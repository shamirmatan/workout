'use server';

import { db } from '@/lib/db';
import { config, completedWorkouts, workoutTemplates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getProgramStartDateForWeek } from '@/lib/week-calculator';
import { calculateWeight, getWeeklyIncrement } from '@/lib/weight-calculator';
import type { ExerciseLog, MainLift, TemplateExercise, Config } from '@/types';

// Get app configuration with calculated current week based on workout completion
export async function getConfig() {
  const results = await db.select().from(config);
  if (results.length === 0) {
    // Insert default config if none exists
    await db.insert(config).values({ id: 'default' });
    return (await db.select().from(config))[0];
  }

  const configData = results[0];

  // Calculate current week based on workout completion
  // Current week = first week with incomplete workouts
  const calculatedWeek = await calculateCurrentWeekByCompletion();

  return {
    ...configData,
    currentWeek: calculatedWeek,
  };
}

// Calculate current week based on workout completion
async function calculateCurrentWeekByCompletion(): Promise<number> {
  const allCompleted = await db.select().from(completedWorkouts);

  // Create a set of completed workout IDs for fast lookup
  const completedIds = new Set(allCompleted.map(w => w.id));

  // 3 days per week: ['1', '2', '3']
  const dayLabels = ['1', '2', '3'];

  // Check each week starting from 1 (up to 52 weeks for a year)
  for (let week = 1; week <= 52; week++) {
    // Check if all workouts for this week are completed
    const allWorkoutsComplete = dayLabels.every(label =>
      completedIds.has(`week-${week}-day-${label}`)
    );

    // If not all workouts are complete, this is the current week
    if (!allWorkoutsComplete) {
      return week;
    }
  }

  // All 52 weeks complete, return week 52
  return 52;
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

// Map mainLift to config field for starting weight
const LIFT_TO_CONFIG_FIELD: Record<MainLift, string> = {
  squat: 'startingSquat',
  bench: 'startingBench',
  deadlift: 'startingDeadlift',
  ohp: 'startingOhp',
  row: 'startingRow',
  lunges: 'startingLunges',
  goodmornings: 'startingGoodmornings',
  rdl: 'startingRdl',
};

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

  // Update starting weights based on what was actually lifted
  await updateStartingWeights(data.templateId, data.weekNumber, data.exerciseLogs);

  revalidatePath('/');
  revalidatePath('/workouts');
  revalidatePath(`/workouts/${data.weekNumber}/${data.dayLabel}`);
}

// Update starting weights when user lifts different from prescribed
// This ensures future workouts reflect actual progress
async function updateStartingWeights(
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

  // Build config object
  const configTyped: Config = {
    id: configData.id ?? 'default',
    programStartDate: configData.programStartDate,
    currentWeek: configData.currentWeek,
    startingSquat: configData.startingSquat,
    startingBench: configData.startingBench,
    startingDeadlift: configData.startingDeadlift,
    startingOhp: configData.startingOhp,
    startingRow: configData.startingRow ?? 45,
    startingLunges: configData.startingLunges ?? 40,
    startingGoodmornings: configData.startingGoodmornings ?? 30,
    startingRdl: configData.startingRdl ?? 60,
    weeklyIncrement: configData.weeklyIncrement,
    goodmorningsIncrement: configData.goodmorningsIncrement ?? 1.25,
    deloadPercentage: configData.deloadPercentage,
    squatAdjustment: configData.squatAdjustment ?? 0,
    benchAdjustment: configData.benchAdjustment ?? 0,
    deadliftAdjustment: configData.deadliftAdjustment ?? 0,
    ohpAdjustment: configData.ohpAdjustment ?? 0,
  };

  // Track starting weight updates
  const updates: Record<string, number> = {};

  for (const exercise of exercises) {
    // Only process exercises with a mainLift (not RPE exercises like plank)
    if (!exercise.mainLift || exercise.isRPE) continue;

    // Find the corresponding exercise log
    const log = exerciseLogs.find(l => l.exerciseId === exercise.id);
    if (!log || log.sets.length === 0) continue;

    // Find max weight lifted across all completed sets
    const completedSets = log.sets.filter(s => s.completed && s.weight > 0);
    if (completedSets.length === 0) continue;

    const liftedWeight = Math.max(...completedSets.map(s => s.weight));

    // Get the percentage modifier for variations (e.g., pause squat at 96%)
    const percentage = exercise.percentageOfMain ?? 1;

    // Calculate what was prescribed
    const prescribedWeight = calculateWeight(exercise.mainLift, weekNumber, configTyped, percentage);

    // If lifted weight differs by at least 2.5kg, update starting weight
    if (Math.abs(liftedWeight - prescribedWeight) >= 2.5) {
      // Back-calculate new starting weight
      // liftedWeight = (startingWeight + (week-1) * increment) * percentage
      // startingWeight = (liftedWeight / percentage) - (week-1) * increment
      const increment = getWeeklyIncrement(exercise.mainLift, configTyped);
      const newStartingWeight = (liftedWeight / percentage) - (weekNumber - 1) * increment;

      // Round to nearest 2.5kg
      const roundedStartingWeight = Math.round(newStartingWeight / 2.5) * 2.5;

      const configField = LIFT_TO_CONFIG_FIELD[exercise.mainLift];
      updates[configField] = roundedStartingWeight;
    }
  }

  // Update config with new starting weights
  if (Object.keys(updates).length > 0) {
    await db.update(config).set(updates).where(eq(config.id, 'default'));
  }
}

// Get all completed workouts
export async function getCompletedWorkouts() {
  return db.select().from(completedWorkouts);
}

// Get personal records (max weight for each exercise)
export async function getPersonalRecords(): Promise<Record<string, { weight: number; exerciseName: string }>> {
  const allWorkouts = await db.select().from(completedWorkouts);

  const records: Record<string, { weight: number; exerciseName: string }> = {};

  for (const workout of allWorkouts) {
    const logs: ExerciseLog[] = JSON.parse(workout.exerciseLogsJson);

    for (const log of logs) {
      // Find max weight across all completed sets
      const completedSets = log.sets.filter(s => s.completed && s.weight > 0);
      if (completedSets.length === 0) continue;

      const maxWeight = Math.max(...completedSets.map(s => s.weight));

      // Update record if this is higher
      if (!records[log.exerciseName] || maxWeight > records[log.exerciseName].weight) {
        records[log.exerciseName] = {
          weight: maxWeight,
          exerciseName: log.exerciseName,
        };
      }
    }
  }

  return records;
}

// Get last used weights for exercises (for pre-filling accessory exercises)
export async function getLastUsedWeights(): Promise<Record<string, number>> {
  const allWorkouts = await db.select().from(completedWorkouts);

  // Sort by week number descending to get most recent first
  allWorkouts.sort((a, b) => b.weekNumber - a.weekNumber);

  const lastWeights: Record<string, number> = {};

  for (const workout of allWorkouts) {
    const logs: ExerciseLog[] = JSON.parse(workout.exerciseLogsJson);

    for (const log of logs) {
      // Only set if we haven't already found a more recent weight for this exercise
      if (lastWeights[log.exerciseId] === undefined) {
        // Find the max weight used in completed sets
        const completedSets = log.sets.filter(s => s.completed && s.weight > 0);
        if (completedSets.length > 0) {
          lastWeights[log.exerciseId] = Math.max(...completedSets.map(s => s.weight));
        }
      }
    }
  }

  return lastWeights;
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
