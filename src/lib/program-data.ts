import type { Phase, WorkoutTemplate, MainLift } from '@/types';

export const PHASES: readonly Phase[] = [
  { number: 1, name: 'Foundation', startWeek: 1, endWeek: 8, daysPerWeek: 3, labels: ['A', 'B', 'C'] },
  { number: 2, name: 'Strength Building', startWeek: 9, endWeek: 20, daysPerWeek: 4, labels: ['1', '2', '3', '4'] },
  { number: 3, name: 'Peaking', startWeek: 21, endWeek: 26, daysPerWeek: 3, labels: ['1', '2', '3'] },
] as const;

export const DELOAD_WEEKS = [13, 17, 25] as const;
export const TEST_WEEK = 26;

export const PHASE1_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'phase1-A',
    phaseNumber: 1,
    dayLabel: 'A',
    name: 'SQUAT/PUSH',
    exercises: [
      {
        id: 'back-squat',
        name: 'Back Squat',
        setsReps: '3x10',
        mainLift: 'squat',
        weekVariations: [
          { weekRange: [1, 4], setsReps: '3x10' },
          { weekRange: [5, 6], setsReps: '4x10' },
          { weekRange: [7, 8], setsReps: '5x8' },
        ]
      },
      {
        id: 'bench-press',
        name: 'Bench Press',
        setsReps: '3x10',
        mainLift: 'bench',
        weekVariations: [
          { weekRange: [1, 4], setsReps: '3x10' },
          { weekRange: [5, 6], setsReps: '4x10' },
          { weekRange: [7, 8], setsReps: '5x8' },
        ]
      },
      {
        id: 'rdl',
        name: 'Romanian Deadlift',
        setsReps: '3x12',
        mainLift: 'deadlift',
        percentageOfMain: 0.75,
        weekVariations: [
          { weekRange: [1, 4], setsReps: '3x12' },
          { weekRange: [5, 8], setsReps: '3x8' },
        ]
      },
      { id: 'shoulder-press', name: 'Overhead Press', setsReps: '3x10', mainLift: 'ohp' },
      { id: 'planks', name: 'Planks', setsReps: '3x45-60sec' },
    ],
  },
  {
    id: 'phase1-B',
    phaseNumber: 1,
    dayLabel: 'B',
    name: 'DEADLIFT/PULL',
    exercises: [
      {
        id: 'deadlift',
        name: 'Deadlift',
        setsReps: '3x8',
        mainLift: 'deadlift',
        weekVariations: [
          { weekRange: [1, 4], setsReps: '3x8' },
          { weekRange: [5, 6], setsReps: '4x6' },
          { weekRange: [7, 8], setsReps: '5x5' },
        ]
      },
      {
        id: 'front-squat',
        name: 'Front Squat',
        setsReps: '3x10',
        mainLift: 'squat',
        percentageOfMain: 0.65,
        weekVariations: [
          { weekRange: [1, 4], setsReps: '3x10' },
          { weekRange: [5, 8], setsReps: '3x8' },
        ]
      },
      { id: 'ohp', name: 'Overhead Press', setsReps: '3x10', mainLift: 'ohp' },
      { id: 'barbell-rows', name: 'Barbell Rows', setsReps: '3x12' },
      { id: 'good-mornings', name: 'Good Mornings', setsReps: '3x15' },
    ],
  },
  {
    id: 'phase1-C',
    phaseNumber: 1,
    dayLabel: 'C',
    name: 'VOLUME',
    exercises: [
      {
        id: 'back-squat-volume',
        name: 'Back Squat',
        setsReps: '4x12',
        mainLift: 'squat',
        percentageOfMain: 0.85,
        weekVariations: [
          { weekRange: [1, 4], setsReps: '4x12' },
          { weekRange: [5, 8], setsReps: '4x10' },
        ]
      },
      {
        id: 'bench-volume',
        name: 'Bench Press',
        setsReps: '4x12',
        mainLift: 'bench',
        percentageOfMain: 0.85,
        weekVariations: [
          { weekRange: [1, 4], setsReps: '4x12' },
          { weekRange: [5, 8], setsReps: '4x10' },
        ]
      },
      { id: 'lunges', name: 'Lunges', setsReps: '3x10 each' },
      { id: 'pushups', name: 'Push-ups', setsReps: '3xAMRAP' },
      { id: 'rear-delt-raises', name: 'Rear Delt Raises', setsReps: '3x15' },
    ],
  },
];

export const PHASE2_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'phase2-1',
    phaseNumber: 2,
    dayLabel: '1',
    name: 'SQUAT FOCUS',
    exercises: [
      { id: 'back-squat', name: 'Back Squat', setsReps: '5x5', mainLift: 'squat' },
      { id: 'front-squat', name: 'Front Squat', setsReps: '3x8', mainLift: 'squat', percentageOfMain: 0.65 },
      { id: 'rdl', name: 'Romanian Deadlift', setsReps: '3x10', mainLift: 'deadlift', percentageOfMain: 0.75 },
      { id: 'leg-press', name: 'Leg Press/Lunges', setsReps: '3x12' },
    ],
  },
  {
    id: 'phase2-2',
    phaseNumber: 2,
    dayLabel: '2',
    name: 'BENCH FOCUS',
    exercises: [
      { id: 'bench-press', name: 'Bench Press', setsReps: '5x5', mainLift: 'bench' },
      { id: 'ohp', name: 'Overhead Press', setsReps: '3x8', mainLift: 'ohp' },
      { id: 'incline-db-press', name: 'Incline DB Press', setsReps: '3x10' },
      { id: 'db-rows', name: 'DB Rows', setsReps: '4x10' },
    ],
  },
  {
    id: 'phase2-3',
    phaseNumber: 2,
    dayLabel: '3',
    name: 'DEADLIFT FOCUS',
    exercises: [
      { id: 'deadlift', name: 'Deadlift', setsReps: '4x5', mainLift: 'deadlift' },
      { id: 'back-squat', name: 'Back Squat', setsReps: '4x8', mainLift: 'squat', percentageOfMain: 0.70 },
      { id: 'leg-curls', name: 'Leg Curls', setsReps: '3x10' },
      { id: 'pullups', name: 'Pull-ups', setsReps: '3x8-10' },
    ],
  },
  {
    id: 'phase2-4',
    phaseNumber: 2,
    dayLabel: '4',
    name: 'VOLUME & ACCESSORIES',
    exercises: [
      { id: 'pause-squats', name: 'Pause Squats', setsReps: '3x5', mainLift: 'squat', percentageOfMain: 0.70 },
      { id: 'close-grip-bench', name: 'Close-Grip Bench', setsReps: '4x8', mainLift: 'bench', percentageOfMain: 0.75 },
      { id: 'bulgarian-split', name: 'Bulgarian Split Squats', setsReps: '3x10 each' },
      { id: 'shoulder-press', name: 'Overhead Press', setsReps: '3x10', mainLift: 'ohp' },
    ],
  },
];

export const PHASE3_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'phase3-1',
    phaseNumber: 3,
    dayLabel: '1',
    name: 'HEAVY SQUAT',
    exercises: [
      { id: 'back-squat', name: 'Back Squat', setsReps: '3x3', mainLift: 'squat' },
      { id: 'front-squat', name: 'Front Squat', setsReps: '3x5', mainLift: 'squat', percentageOfMain: 0.60 },
      { id: 'rdl', name: 'Romanian Deadlift', setsReps: '3x8', mainLift: 'deadlift', percentageOfMain: 0.75 },
    ],
  },
  {
    id: 'phase3-2',
    phaseNumber: 3,
    dayLabel: '2',
    name: 'HEAVY BENCH',
    exercises: [
      { id: 'bench-press', name: 'Bench Press', setsReps: '3x3', mainLift: 'bench' },
      { id: 'ohp', name: 'Overhead Press', setsReps: '3x5', mainLift: 'ohp' },
      { id: 'db-rows', name: 'DB Rows', setsReps: '3x8' },
    ],
  },
  {
    id: 'phase3-3',
    phaseNumber: 3,
    dayLabel: '3',
    name: 'HEAVY DEADLIFT',
    exercises: [
      { id: 'deadlift', name: 'Deadlift', setsReps: '3x3', mainLift: 'deadlift' },
      { id: 'speed-squats', name: 'Speed Squats', setsReps: '3x5', mainLift: 'squat', percentageOfMain: 0.65 },
      { id: 'hamstring-work', name: 'Hamstring Work', setsReps: '2-3 sets' },
    ],
  },
];

export const ALL_TEMPLATES = [...PHASE1_TEMPLATES, ...PHASE2_TEMPLATES, ...PHASE3_TEMPLATES];

// Get phase for a given week
export function getPhaseForWeek(week: number): Phase {
  const phase = PHASES.find(p => week >= p.startWeek && week <= p.endWeek);
  if (!phase) throw new Error(`No phase found for week ${week}`);
  return phase;
}

// Get workout labels for a given week
export function getWorkoutsForWeek(week: number): string[] {
  const phase = getPhaseForWeek(week);
  return [...phase.labels];
}

// Check if week is a deload
export function isDeloadWeek(week: number): boolean {
  return DELOAD_WEEKS.includes(week as typeof DELOAD_WEEKS[number]);
}

// Get template for a specific phase and day
export function getTemplate(phaseNumber: number, dayLabel: string): WorkoutTemplate | undefined {
  return ALL_TEMPLATES.find(t => t.phaseNumber === phaseNumber && t.dayLabel === dayLabel);
}

// Re-export MainLift type for convenience
export type { MainLift };
