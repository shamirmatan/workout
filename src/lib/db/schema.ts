import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Program configuration (single row for single user)
// Note: startingX fields are now used as Training Maxes for percentage-based programming
export const config = sqliteTable('config', {
  id: text('id').primaryKey().default('default'),
  programStartDate: text('program_start_date'),
  startingSquat: real('starting_squat').notNull().default(80),    // Training max in kg
  startingBench: real('starting_bench').notNull().default(60),    // Training max in kg
  startingDeadlift: real('starting_deadlift').notNull().default(75), // Training max in kg
  startingOhp: real('starting_ohp').notNull().default(40),        // Training max in kg
  weeklyIncrement: real('weekly_increment').notNull().default(0), // Not used in percentage program
  deloadPercentage: real('deload_percentage').notNull().default(1), // Not used in percentage program
  currentWeek: integer('current_week').notNull().default(1),
  // Weight adjustments: track difference between prescribed and actual lifted weights
  squatAdjustment: real('squat_adjustment').notNull().default(0),
  benchAdjustment: real('bench_adjustment').notNull().default(0),
  deadliftAdjustment: real('deadlift_adjustment').notNull().default(0),
  ohpAdjustment: real('ohp_adjustment').notNull().default(0),
});

// Workout templates (seeded from program data, editable)
export const workoutTemplates = sqliteTable('workout_templates', {
  id: text('id').primaryKey(),
  phaseNumber: integer('phase_number').notNull(),
  dayLabel: text('day_label').notNull(),
  name: text('name').notNull(),
  exercisesJson: text('exercises_json').notNull(),
});

// Completed workouts (only created when user logs a workout)
export const completedWorkouts = sqliteTable('completed_workouts', {
  id: text('id').primaryKey(),
  weekNumber: integer('week_number').notNull(),
  phaseNumber: integer('phase_number').notNull(),
  dayLabel: text('day_label').notNull(),
  templateId: text('template_id').notNull(),
  completedAt: text('completed_at').notNull(),
  exerciseLogsJson: text('exercise_logs_json').notNull(),
  notes: text('notes'),
});
