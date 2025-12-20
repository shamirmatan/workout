export type MainLift = 'squat' | 'bench' | 'deadlift' | 'ohp';

export interface WeekVariation {
  weekRange: [number, number];
  setsReps: string;
  intensity?: number; // Percentage of training max (e.g., 0.80 for 80%)
}

export interface TemplateExercise {
  id: string;
  name: string;
  setsReps: string;
  mainLift?: MainLift;
  percentageOfMain?: number; // Static percentage (for exercises without week variations)
  weekVariations?: WeekVariation[];
  isRPE?: boolean; // True if this exercise uses RPE instead of percentage
}

export interface WorkoutTemplate {
  id: string;
  phaseNumber: number;
  dayLabel: string;
  name: string;
  exercises: TemplateExercise[];
}

export interface Phase {
  number: number;
  name: string;
  startWeek: number;
  endWeek: number;
  daysPerWeek: number;
  labels: readonly string[];
}

export interface CompletedSet {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: CompletedSet[];
}

export interface Config {
  id: string;
  programStartDate: string | null;
  startingSquat: number;
  startingBench: number;
  startingDeadlift: number;
  startingOhp: number;
  weeklyIncrement: number;
  deloadPercentage: number;
  currentWeek: number;
  // Weight adjustments from actual lifts
  squatAdjustment: number;
  benchAdjustment: number;
  deadliftAdjustment: number;
  ohpAdjustment: number;
}
