export type MainLift = 'squat' | 'bench' | 'deadlift' | 'rdl' | 'ohp';

export interface TemplateExercise {
  id: string;
  name: string;
  setsReps: string;
  mainLift?: MainLift;
  percentageOfMain?: number;
  weekVariations?: { weekRange: [number, number]; setsReps: string }[];
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
  startingRdl: number;
  startingOhp: number;
  weeklyIncrement: number;
  deloadPercentage: number;
  currentWeek: number;
}
