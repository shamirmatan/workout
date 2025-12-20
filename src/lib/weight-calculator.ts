import type { MainLift, Config, TemplateExercise, WeekVariation } from '@/types';

const LIFT_TO_CONFIG_KEY: Record<MainLift, keyof Config> = {
  squat: 'startingSquat',
  bench: 'startingBench',
  deadlift: 'startingDeadlift',
  ohp: 'startingOhp',
};

export const LIFT_TO_ADJUSTMENT_KEY: Record<MainLift, keyof Config> = {
  squat: 'squatAdjustment',
  bench: 'benchAdjustment',
  deadlift: 'deadliftAdjustment',
  ohp: 'ohpAdjustment',
};

// Get training max for a lift (config stores training maxes in startingX fields)
export function getTrainingMax(mainLift: MainLift, config: Config): number {
  return config[LIFT_TO_CONFIG_KEY[mainLift]] as number;
}

// Calculate weight based on training max and intensity percentage
export function calculateWeight(
  mainLift: MainLift,
  weekNumber: number,
  config: Config,
  intensity: number = 1
): number {
  const trainingMax = getTrainingMax(mainLift, config);
  const adjustment = (config[LIFT_TO_ADJUSTMENT_KEY[mainLift]] as number) || 0;

  // Weight = training max * intensity + any adjustment
  const weight = trainingMax * intensity + adjustment;

  // Round to nearest 2.5kg
  return Math.round(weight / 2.5) * 2.5;
}

// Get the week variation for a specific week
export function getWeekVariation(
  exercise: Pick<TemplateExercise, 'weekVariations'>,
  weekNumber: number
): WeekVariation | undefined {
  if (!exercise.weekVariations) return undefined;

  return exercise.weekVariations.find(
    v => weekNumber >= v.weekRange[0] && weekNumber <= v.weekRange[1]
  );
}

// Get sets/reps for an exercise based on week (handles week variations)
export function getSetsRepsForWeek(
  exercise: Pick<TemplateExercise, 'setsReps' | 'weekVariations'>,
  weekNumber: number
): string {
  const variation = getWeekVariation(exercise, weekNumber);
  return variation?.setsReps || exercise.setsReps;
}

// Get intensity for an exercise based on week
export function getIntensityForWeek(
  exercise: Pick<TemplateExercise, 'percentageOfMain' | 'weekVariations'>,
  weekNumber: number
): number | undefined {
  const variation = getWeekVariation(exercise, weekNumber);
  // Week-specific intensity takes precedence over static percentageOfMain
  return variation?.intensity ?? exercise.percentageOfMain;
}

// Check if an exercise is active for a given week
// An exercise is active if it has no weekVariations OR has a matching weekVariation
export function isExerciseActiveForWeek(
  exercise: Pick<TemplateExercise, 'weekVariations'>,
  weekNumber: number
): boolean {
  if (!exercise.weekVariations || exercise.weekVariations.length === 0) {
    return true; // No week restrictions, always active
  }
  return exercise.weekVariations.some(
    v => weekNumber >= v.weekRange[0] && weekNumber <= v.weekRange[1]
  );
}

// Parse sets x reps string (e.g., "5x5" -> { sets: 5, reps: "5" })
export function parseSetsReps(setsReps: string): { sets: number; reps: string } {
  const match = setsReps.match(/^(\d+)x(.+)$/);
  if (match) {
    return { sets: parseInt(match[1]), reps: match[2] };
  }
  return { sets: 1, reps: setsReps };
}

// Get weight for an exercise based on its configuration and week
export function getExerciseWeight(
  exercise: Pick<TemplateExercise, 'mainLift' | 'percentageOfMain' | 'weekVariations' | 'isRPE'>,
  weekNumber: number,
  config: Config
): number | null {
  // RPE exercises don't have prescribed weights
  if (exercise.isRPE) {
    return null;
  }

  if (!exercise.mainLift) {
    return null;
  }

  const intensity = getIntensityForWeek(exercise, weekNumber);
  if (intensity === undefined) {
    return null;
  }

  return calculateWeight(exercise.mainLift, weekNumber, config, intensity);
}

export function getAllWeightsForWeek(
  weekNumber: number,
  config: Config
): Record<MainLift, number> {
  return {
    squat: getTrainingMax('squat', config),
    bench: getTrainingMax('bench', config),
    deadlift: getTrainingMax('deadlift', config),
    ohp: getTrainingMax('ohp', config),
  };
}
