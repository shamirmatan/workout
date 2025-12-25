import type { MainLift, Config, TemplateExercise, WeekVariation } from '@/types';

// Map lift type to config field for starting weight
const LIFT_TO_CONFIG_KEY: Record<MainLift, keyof Config> = {
  squat: 'startingSquat',
  bench: 'startingBench',
  deadlift: 'startingDeadlift',
  ohp: 'startingOhp',
  row: 'startingRow',
  lunges: 'startingLunges',
  goodmornings: 'startingGoodmornings',
  rdl: 'startingRdl',
};

// Legacy adjustment keys (kept for compatibility, not used in linear program)
export const LIFT_TO_ADJUSTMENT_KEY: Record<MainLift, keyof Config> = {
  squat: 'squatAdjustment',
  bench: 'benchAdjustment',
  deadlift: 'deadliftAdjustment',
  ohp: 'ohpAdjustment',
  row: 'squatAdjustment', // Not used
  lunges: 'squatAdjustment', // Not used
  goodmornings: 'squatAdjustment', // Not used
  rdl: 'deadliftAdjustment', // Not used
};

// Get starting weight for a lift from config
export function getStartingWeight(mainLift: MainLift, config: Config): number {
  return config[LIFT_TO_CONFIG_KEY[mainLift]] as number;
}

// Get weekly increment for a lift
export function getWeeklyIncrement(mainLift: MainLift, config: Config): number {
  if (mainLift === 'goodmornings') {
    return config.goodmorningsIncrement || 1.25;
  }
  return config.weeklyIncrement || 2.5;
}

// Calculate weight for a given week using linear progression
// Weight = startingWeight + (week - 1) * increment
export function calculateWeight(
  mainLift: MainLift,
  weekNumber: number,
  config: Config,
  percentageModifier: number = 1
): number {
  const startingWeight = getStartingWeight(mainLift, config);
  const increment = getWeeklyIncrement(mainLift, config);

  // Linear progression: add increment for each week after week 1
  const baseWeight = startingWeight + (weekNumber - 1) * increment;

  // Apply percentage modifier (for variations like pause squat at 96%)
  const weight = baseWeight * percentageModifier;

  // Round to nearest 2.5kg
  return Math.round(weight / 2.5) * 2.5;
}

// Legacy function for compatibility - returns starting weight
export function getTrainingMax(mainLift: MainLift, config: Config): number {
  return getStartingWeight(mainLift, config);
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

// Get intensity/percentage for an exercise based on week
export function getIntensityForWeek(
  exercise: Pick<TemplateExercise, 'percentageOfMain' | 'weekVariations'>,
  weekNumber: number
): number | undefined {
  const variation = getWeekVariation(exercise, weekNumber);
  // Week-specific intensity takes precedence over static percentageOfMain
  return variation?.intensity ?? exercise.percentageOfMain;
}

// Check if an exercise is active for a given week
export function isExerciseActiveForWeek(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  exercise: Pick<TemplateExercise, 'weekVariations'>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  weekNumber: number
): boolean {
  // In the simplified program, all exercises are always active
  // No week restrictions
  return true;
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

  // Get percentage modifier (defaults to 1 for main lifts)
  const percentage = exercise.percentageOfMain ?? 1;

  return calculateWeight(exercise.mainLift, weekNumber, config, percentage);
}

// Get all starting weights (for display purposes)
export function getAllWeightsForWeek(
  weekNumber: number,
  config: Config
): Record<MainLift, number> {
  return {
    squat: calculateWeight('squat', weekNumber, config),
    bench: calculateWeight('bench', weekNumber, config),
    deadlift: calculateWeight('deadlift', weekNumber, config),
    ohp: calculateWeight('ohp', weekNumber, config),
    row: calculateWeight('row', weekNumber, config),
    lunges: calculateWeight('lunges', weekNumber, config),
    goodmornings: calculateWeight('goodmornings', weekNumber, config),
    rdl: calculateWeight('rdl', weekNumber, config),
  };
}
