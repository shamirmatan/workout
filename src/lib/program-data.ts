import type { Phase, WorkoutTemplate } from '@/types';

// Open-ended program: 2 days per week, linear progression
// Using a large endWeek (999) to make it effectively unlimited
export const PHASES: readonly Phase[] = [
  { number: 1, name: 'Linear Progression', startWeek: 1, endWeek: 999, daysPerWeek: 2, labels: ['1', '2'] },
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
      id: 'plank-day1',
      name: 'Plank (seconds)',
      setsReps: '1x180',
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
      id: 'plank-day2',
      name: 'Plank (seconds)',
      setsReps: '1x180',
      isRPE: true,
    },
  ],
};

// All templates - used for seeding
export const ALL_TEMPLATES = [DAY1_TEMPLATE, DAY2_TEMPLATE];

// Get phase for a given week (always returns the single phase)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getPhaseForWeek(week: number): Phase {
  return PHASES[0];
}

// Get workout labels for a given week
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getWorkoutsForWeek(week: number): string[] {
  return ['1', '2'];
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
