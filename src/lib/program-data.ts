import type { Phase, WorkoutTemplate } from '@/types';

// Open-ended program: 3 days per week, linear progression
// Using a large endWeek (999) to make it effectively unlimited
export const PHASES: readonly Phase[] = [
  { number: 1, name: 'Linear Progression', startWeek: 1, endWeek: 999, daysPerWeek: 3, labels: ['1', '2', '3'] },
] as const;

// No deload weeks - user decides when to deload
export const DELOAD_WEEKS: readonly number[] = [] as const;
export const TEST_WEEK = 999; // Not used in this program

// Day 1: Squat + Bench Focus
const DAY1_TEMPLATE: WorkoutTemplate = {
  id: 'day-1',
  phaseNumber: 1,
  dayLabel: '1',
  name: 'SQUAT & BENCH',
  exercises: [
    {
      id: 'back-squat',
      name: 'Back Squat',
      setsReps: '4x5',
      mainLift: 'squat',
    },
    {
      id: 'bench-press',
      name: 'Bench Press',
      setsReps: '4x5',
      mainLift: 'bench',
    },
    {
      id: 'pendlay-row',
      name: 'Pendlay Row',
      setsReps: '3x8',
      mainLift: 'row',
    },
    {
      id: 'plank-day1',
      name: 'Plank (seconds)',
      setsReps: '3x60',
      isRPE: true,
    },
  ],
};

// Day 2: Deadlift + OHP Focus
const DAY2_TEMPLATE: WorkoutTemplate = {
  id: 'day-2',
  phaseNumber: 1,
  dayLabel: '2',
  name: 'DEADLIFT & OHP',
  exercises: [
    {
      id: 'deadlift',
      name: 'Deadlift',
      setsReps: '4x5',
      mainLift: 'deadlift',
    },
    {
      id: 'overhead-press',
      name: 'Overhead Press',
      setsReps: '3x8',
      mainLift: 'ohp',
    },
    {
      id: 'back-lunges',
      name: 'Back Lunges (per leg)',
      setsReps: '3x8',
      mainLift: 'lunges',
    },
    {
      id: 'good-mornings',
      name: 'Good Mornings',
      setsReps: '3x8',
      mainLift: 'goodmornings',
    },
  ],
};

// Day 3: Variations
const DAY3_TEMPLATE: WorkoutTemplate = {
  id: 'day-3',
  phaseNumber: 1,
  dayLabel: '3',
  name: 'VARIATIONS',
  exercises: [
    {
      id: 'pause-squat',
      name: 'Pause Squat',
      setsReps: '3x6',
      mainLift: 'squat',
      percentageOfMain: 0.96, // Slightly lighter for pause work
    },
    {
      id: 'pause-bench',
      name: 'Pause Bench',
      setsReps: '3x6',
      mainLift: 'bench',
    },
    {
      id: 'romanian-deadlift',
      name: 'Romanian Deadlift',
      setsReps: '3x8',
      mainLift: 'rdl',
    },
    {
      id: 'plank-day3',
      name: 'Plank (seconds)',
      setsReps: '3x60',
      isRPE: true,
    },
  ],
};

// All templates - used for seeding
export const ALL_TEMPLATES = [DAY1_TEMPLATE, DAY2_TEMPLATE, DAY3_TEMPLATE];

// Get phase for a given week (always returns the single phase)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getPhaseForWeek(week: number): Phase {
  return PHASES[0];
}

// Get workout labels for a given week
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getWorkoutsForWeek(week: number): string[] {
  return ['1', '2', '3'];
}

// Check if week is a deload (not used in this program)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isDeloadWeek(week: number): boolean {
  return false;
}

// Get template for a specific day (phaseNumber is kept for API compatibility)
export function getTemplate(_phaseNumber: number, dayLabel: string): WorkoutTemplate | undefined {
  void _phaseNumber; // Unused in simplified program
  return ALL_TEMPLATES.find(t => t.dayLabel === dayLabel);
}

// Re-export MainLift type for convenience
export type { MainLift } from '@/types';
