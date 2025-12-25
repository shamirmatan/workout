import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Program configuration (single row for single user)
// Linear progression: weight = starting + (week - 1) * increment
export const config = sqliteTable('config', {
  id: text('id').primaryKey().default('default'),
  programStartDate: text('program_start_date'),
  currentWeek: integer('current_week').notNull().default(1),

  // Starting weights for each lift (kg)
  startingSquat: real('starting_squat').notNull().default(62.5),
  startingBench: real('starting_bench').notNull().default(45),
  startingDeadlift: real('starting_deadlift').notNull().default(65),
  startingOhp: real('starting_ohp').notNull().default(32.5),
  startingRow: real('starting_row').notNull().default(45),
  startingLunges: real('starting_lunges').notNull().default(40),
  startingGoodmornings: real('starting_goodmornings').notNull().default(30),
  startingRdl: real('starting_rdl').notNull().default(60),

  // Weekly increments (kg)
  weeklyIncrement: real('weekly_increment').notNull().default(2.5),
  goodmorningsIncrement: real('goodmornings_increment').notNull().default(1.25),

  // Legacy fields (kept for compatibility)
  deloadPercentage: real('deload_percentage').notNull().default(1),
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
