import { DELOAD_WEEKS } from './program-data';
import type { MainLift, Config, TemplateExercise } from '@/types';

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

export function calculateWeight(
  mainLift: MainLift,
  weekNumber: number,
  config: Config,
  percentageOfMain: number = 1
): number {
  const startWeight = config[LIFT_TO_CONFIG_KEY[mainLift]] as number;
  const adjustment = (config[LIFT_TO_ADJUSTMENT_KEY[mainLift]] as number) || 0;
  const { weeklyIncrement, deloadPercentage } = config;

  // Count progression weeks (excluding deloads before this week)
  let progressionWeeks = weekNumber - 1;
  for (const deloadWeek of DELOAD_WEEKS) {
    if (deloadWeek < weekNumber) {
      progressionWeeks--;
    }
  }

  // Base weight with linear progression + any adjustment from actual lifts
  let weight = startWeight + progressionWeeks * weeklyIncrement + adjustment;

  // Apply deload if this is a deload week
  if (DELOAD_WEEKS.includes(weekNumber as typeof DELOAD_WEEKS[number])) {
    weight = weight * deloadPercentage;
  }

  // Apply percentage modifier for accessory lifts
  weight = weight * percentageOfMain;

  // Round to nearest 2.5kg
  return Math.round(weight / 2.5) * 2.5;
}

// Calculate weight WITHOUT adjustment (for comparing prescribed vs actual)
export function calculatePrescribedWeight(
  mainLift: MainLift,
  weekNumber: number,
  config: Config,
  percentageOfMain: number = 1
): number {
  const startWeight = config[LIFT_TO_CONFIG_KEY[mainLift]] as number;
  const { weeklyIncrement, deloadPercentage } = config;

  let progressionWeeks = weekNumber - 1;
  for (const deloadWeek of DELOAD_WEEKS) {
    if (deloadWeek < weekNumber) {
      progressionWeeks--;
    }
  }

  let weight = startWeight + progressionWeeks * weeklyIncrement;

  if (DELOAD_WEEKS.includes(weekNumber as typeof DELOAD_WEEKS[number])) {
    weight = weight * deloadPercentage;
  }

  weight = weight * percentageOfMain;

  return Math.round(weight / 2.5) * 2.5;
}

export function getAllWeightsForWeek(
  weekNumber: number,
  config: Config
): Record<MainLift, number> {
  return {
    squat: calculateWeight('squat', weekNumber, config),
    bench: calculateWeight('bench', weekNumber, config),
    deadlift: calculateWeight('deadlift', weekNumber, config),
    ohp: calculateWeight('ohp', weekNumber, config),
  };
}

// Get sets/reps for an exercise based on week (handles week variations)
export function getSetsRepsForWeek(
  exercise: Pick<TemplateExercise, 'setsReps' | 'weekVariations'>,
  weekNumber: number
): string {
  if (!exercise.weekVariations) {
    return exercise.setsReps;
  }

  const variation = exercise.weekVariations.find(
    v => weekNumber >= v.weekRange[0] && weekNumber <= v.weekRange[1]
  );

  return variation?.setsReps || exercise.setsReps;
}

// Parse sets x reps string (e.g., "5x5" -> { sets: 5, reps: "5" })
export function parseSetsReps(setsReps: string): { sets: number; reps: string } {
  const match = setsReps.match(/^(\d+)x(.+)$/);
  if (match) {
    return { sets: parseInt(match[1]), reps: match[2] };
  }
  return { sets: 1, reps: setsReps };
}

// Get weight for an exercise based on its configuration
export function getExerciseWeight(
  exercise: Pick<TemplateExercise, 'mainLift' | 'percentageOfMain'>,
  weekNumber: number,
  config: Config
): number | null {
  if (!exercise.mainLift) {
    return null;
  }
  return calculateWeight(
    exercise.mainLift,
    weekNumber,
    config,
    exercise.percentageOfMain ?? 1
  );
}
