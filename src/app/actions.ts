'use server';

import { db } from '@/lib/db';
import { config, completedWorkouts, workoutTemplates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { calculateCurrentWeek, getProgramStartDateForWeek } from '@/lib/week-calculator';
import type { ExerciseLog } from '@/types';

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

  revalidatePath('/');
  revalidatePath('/workouts');
  revalidatePath(`/workouts/${data.weekNumber}/${data.dayLabel}`);
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
