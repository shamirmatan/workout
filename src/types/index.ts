export type MainLift = 'squat' | 'bench' | 'deadlift' | 'ohp' | 'row' | 'lunges' | 'goodmornings' | 'rdl';

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
  percentageOfMain?: number; // For variations (e.g., pause squat = 96% of squat)
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
  currentWeek: number;
  // Starting weights for each lift
  startingSquat: number;
  startingBench: number;
  startingDeadlift: number;
  startingOhp: number;
  startingRow: number;
  startingLunges: number;
  startingGoodmornings: number;
  startingRdl: number;
  // Weekly increments
  weeklyIncrement: number; // Default 2.5 kg
  goodmorningsIncrement: number; // Slower at 1.25 kg
  // Legacy fields (not used but kept for compatibility)
  deloadPercentage: number;
  squatAdjustment: number;
  benchAdjustment: number;
  deadliftAdjustment: number;
  ohpAdjustment: number;
}
