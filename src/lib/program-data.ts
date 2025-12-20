import type { Phase, WorkoutTemplate, MainLift } from '@/types';

// 16-week program: 4 days per week, percentage-based
export const PHASES: readonly Phase[] = [
  { number: 1, name: 'Block 1', startWeek: 1, endWeek: 4, daysPerWeek: 4, labels: ['1', '2', '3', '4'] },
  { number: 2, name: 'Block 2', startWeek: 5, endWeek: 8, daysPerWeek: 4, labels: ['1', '2', '3', '4'] },
  { number: 3, name: 'Block 3', startWeek: 9, endWeek: 11, daysPerWeek: 4, labels: ['1', '2', '3', '4'] },
  { number: 4, name: 'Block 4', startWeek: 12, endWeek: 15, daysPerWeek: 4, labels: ['1', '2', '3', '4'] },
  { number: 5, name: 'Taper', startWeek: 16, endWeek: 16, daysPerWeek: 4, labels: ['1', '2', '3', '4'] },
] as const;

// No deload weeks in this program - intensity is managed per exercise
export const DELOAD_WEEKS: readonly number[] = [] as const;
export const TEST_WEEK = 16;

// Day 1 Template - Squat/Bench Focus
const DAY1_TEMPLATE: WorkoutTemplate = {
  id: 'day-1',
  phaseNumber: 1, // Will be reused across phases
  dayLabel: '1',
  name: 'SQUAT & BENCH',
  exercises: [
    {
      id: 'comp-squat-main',
      name: 'Competition Squat',
      setsReps: '4x7',
      mainLift: 'squat',
      weekVariations: [
        { weekRange: [1, 1], setsReps: '4x7', intensity: 0.67 },
        { weekRange: [2, 2], setsReps: '4x6', intensity: 0.70 },
        { weekRange: [3, 3], setsReps: '4x6', intensity: 0.73 },
        { weekRange: [4, 4], setsReps: '5x5', intensity: 0.75 },
        { weekRange: [5, 5], setsReps: '3x3', intensity: 0.80 },
        { weekRange: [6, 6], setsReps: '4x3', intensity: 0.82 },
        { weekRange: [7, 7], setsReps: '5x2', intensity: 0.86 },
        { weekRange: [8, 8], setsReps: '4x3', intensity: 0.85 },
        { weekRange: [9, 9], setsReps: '5x4', intensity: 0.82 },
        { weekRange: [10, 10], setsReps: '6x3', intensity: 0.85 },
        { weekRange: [11, 11], setsReps: '3x3', intensity: 0.83 },
        { weekRange: [12, 12], setsReps: '1x3', intensity: 0.85 }, // 8RPE top set
        { weekRange: [13, 13], setsReps: '1x2', intensity: 0.85 },
        { weekRange: [14, 14], setsReps: '1x1', intensity: 0.88 },
        { weekRange: [15, 15], setsReps: '1x1', intensity: 0.88 },
        { weekRange: [16, 16], setsReps: '1x1', intensity: 0.90 }, // Opener
      ],
    },
    {
      id: 'comp-squat-backoff',
      name: 'Competition Squat (Backoff)',
      setsReps: '2x5',
      mainLift: 'squat',
      weekVariations: [
        { weekRange: [5, 5], setsReps: '2x5', intensity: 0.68 },
        { weekRange: [6, 6], setsReps: '2x5', intensity: 0.70 },
        { weekRange: [7, 7], setsReps: '2x4', intensity: 0.72 },
        { weekRange: [8, 8], setsReps: '3x4', intensity: 0.75 },
        { weekRange: [9, 9], setsReps: '2x4', intensity: 0.71 },
        { weekRange: [10, 10], setsReps: '2x4', intensity: 0.74 },
        { weekRange: [11, 11], setsReps: '2x4', intensity: 0.76 },
        { weekRange: [12, 12], setsReps: '6x5', intensity: 0.65 },
        { weekRange: [13, 13], setsReps: '6x5', intensity: 0.68 },
        { weekRange: [14, 14], setsReps: '4x4', intensity: 0.72 },
        { weekRange: [15, 15], setsReps: '3x3', intensity: 0.76 },
        { weekRange: [16, 16], setsReps: '3x2', intensity: 0.82 },
      ],
    },
    {
      id: 'comp-pause-bench-main',
      name: 'Competition Pause Bench',
      setsReps: '4x7',
      mainLift: 'bench',
      weekVariations: [
        { weekRange: [1, 1], setsReps: '4x7', intensity: 0.67 },
        { weekRange: [2, 2], setsReps: '4x6', intensity: 0.70 },
        { weekRange: [3, 3], setsReps: '4x6', intensity: 0.73 },
        { weekRange: [4, 4], setsReps: '5x5', intensity: 0.75 },
        { weekRange: [5, 5], setsReps: '4x3', intensity: 0.80 },
        { weekRange: [6, 6], setsReps: '5x3', intensity: 0.82 },
        { weekRange: [7, 7], setsReps: '5x2', intensity: 0.86 },
        { weekRange: [8, 8], setsReps: '5x3', intensity: 0.85 },
        { weekRange: [9, 9], setsReps: '6x4', intensity: 0.82 },
        { weekRange: [10, 10], setsReps: '7x4', intensity: 0.85 },
        { weekRange: [11, 11], setsReps: '3x3', intensity: 0.83 },
        { weekRange: [12, 12], setsReps: '1x3', intensity: 0.85 },
        { weekRange: [13, 13], setsReps: '1x2', intensity: 0.85 },
        { weekRange: [14, 14], setsReps: '1x1', intensity: 0.90 },
        { weekRange: [15, 15], setsReps: '1x1', intensity: 0.90 },
        { weekRange: [16, 16], setsReps: '1x1', intensity: 0.92 },
      ],
    },
    {
      id: 'comp-pause-bench-backoff',
      name: 'Competition Pause Bench (Backoff)',
      setsReps: '2x5',
      mainLift: 'bench',
      weekVariations: [
        { weekRange: [5, 5], setsReps: '2x5', intensity: 0.68 },
        { weekRange: [6, 6], setsReps: '3x5', intensity: 0.70 },
        { weekRange: [7, 7], setsReps: '2x4', intensity: 0.72 },
        { weekRange: [8, 8], setsReps: '3x4', intensity: 0.75 },
        { weekRange: [9, 9], setsReps: '2x4', intensity: 0.71 },
        { weekRange: [10, 10], setsReps: '2x4', intensity: 0.74 },
        { weekRange: [11, 11], setsReps: '2x4', intensity: 0.76 },
        { weekRange: [12, 12], setsReps: '7x5', intensity: 0.65 },
        { weekRange: [13, 13], setsReps: '7x5', intensity: 0.68 },
        { weekRange: [14, 14], setsReps: '5x4', intensity: 0.72 },
        { weekRange: [15, 15], setsReps: '4x3', intensity: 0.76 },
        { weekRange: [16, 16], setsReps: '3x2', intensity: 0.84 },
      ],
    },
    {
      id: 'overhead-press',
      name: 'Overhead Press',
      setsReps: '3x8',
      mainLift: 'bench',
      percentageOfMain: 0.50, // ~50% of bench TM
      weekVariations: [
        { weekRange: [1, 2], setsReps: '3x8', intensity: 0.50 },
        { weekRange: [3, 4], setsReps: '3x7', intensity: 0.53 },
        { weekRange: [12, 12], setsReps: '3x6', intensity: 0.55 },
        { weekRange: [13, 13], setsReps: '2x7', intensity: 0.50 },
        { weekRange: [14, 14], setsReps: '3x6', intensity: 0.53 },
        { weekRange: [15, 15], setsReps: '2x5', intensity: 0.55 },
      ],
    },
    {
      id: 'bent-over-row',
      name: 'Bent Over Row',
      setsReps: '3x12',
      mainLift: 'deadlift',
      percentageOfMain: 0.45, // ~45% of deadlift TM
      weekVariations: [
        { weekRange: [1, 2], setsReps: '3x12', intensity: 0.45 },
        { weekRange: [3, 4], setsReps: '3x8', intensity: 0.50 },
        { weekRange: [9, 11], setsReps: '4x8', intensity: 0.50 },
      ],
    },
    {
      id: 'good-mornings',
      name: 'Good Mornings',
      setsReps: '4x12',
      mainLift: 'deadlift',
      percentageOfMain: 0.30, // ~30% of deadlift TM
      weekVariations: [
        { weekRange: [1, 2], setsReps: '4x12', intensity: 0.30 },
        { weekRange: [3, 4], setsReps: '5x10', intensity: 0.33 },
      ],
    },
    {
      id: 'sldl-day1',
      name: 'SLDL',
      setsReps: '4x9',
      mainLift: 'deadlift',
      percentageOfMain: 0.45, // ~45% of deadlift TM
      weekVariations: [
        { weekRange: [5, 6], setsReps: '4x9', intensity: 0.45 },
        { weekRange: [7, 7], setsReps: '4x8', intensity: 0.48 },
        { weekRange: [8, 8], setsReps: '4x7', intensity: 0.50 },
      ],
    },
    {
      id: 'side-planks',
      name: 'Side Planks (sec/side)',
      setsReps: '3x30s',
      weekVariations: [
        { weekRange: [5, 6], setsReps: '3x30s' },
        { weekRange: [7, 8], setsReps: '4x45s' },
      ],
    },
    {
      id: 'rolling-planks',
      name: 'Rolling Planks (total)',
      setsReps: '3x20',
      weekVariations: [
        { weekRange: [9, 9], setsReps: '3x20' },
        { weekRange: [10, 10], setsReps: '4x20' },
        { weekRange: [11, 11], setsReps: '4x24' },
      ],
    },
  ],
};

// Day 2 Template - Deadlift Focus
const DAY2_TEMPLATE: WorkoutTemplate = {
  id: 'day-2',
  phaseNumber: 1,
  dayLabel: '2',
  name: 'DEADLIFT & SQUAT',
  exercises: [
    {
      id: 'comp-deadlift-main',
      name: 'Competition Deadlift',
      setsReps: '4x7',
      mainLift: 'deadlift',
      weekVariations: [
        { weekRange: [1, 1], setsReps: '4x7', intensity: 0.67 },
        { weekRange: [2, 2], setsReps: '4x6', intensity: 0.70 },
        { weekRange: [3, 3], setsReps: '4x6', intensity: 0.73 },
        { weekRange: [4, 4], setsReps: '5x5', intensity: 0.75 },
        { weekRange: [5, 5], setsReps: '3x3', intensity: 0.80 },
        { weekRange: [6, 6], setsReps: '4x3', intensity: 0.82 },
        { weekRange: [7, 7], setsReps: '5x2', intensity: 0.86 },
        { weekRange: [8, 8], setsReps: '4x3', intensity: 0.85 },
        { weekRange: [9, 9], setsReps: '4x4', intensity: 0.82 },
        { weekRange: [10, 10], setsReps: '5x3', intensity: 0.85 },
        { weekRange: [11, 11], setsReps: '3x3', intensity: 0.83 },
        { weekRange: [12, 12], setsReps: '1x3', intensity: 0.85 },
        { weekRange: [13, 13], setsReps: '1x2', intensity: 0.85 },
        { weekRange: [14, 14], setsReps: '1x1', intensity: 0.88 },
        { weekRange: [15, 15], setsReps: '1x1', intensity: 0.88 },
        { weekRange: [16, 16], setsReps: '1x1', intensity: 0.90 },
      ],
    },
    {
      id: 'comp-deadlift-backoff',
      name: 'Competition Deadlift (Backoff)',
      setsReps: '2x5',
      mainLift: 'deadlift',
      weekVariations: [
        { weekRange: [5, 5], setsReps: '2x5', intensity: 0.68 },
        { weekRange: [6, 6], setsReps: '2x5', intensity: 0.70 },
        { weekRange: [7, 7], setsReps: '2x4', intensity: 0.72 },
        { weekRange: [8, 8], setsReps: '3x4', intensity: 0.75 },
        { weekRange: [9, 9], setsReps: '2x4', intensity: 0.71 },
        { weekRange: [10, 10], setsReps: '2x4', intensity: 0.74 },
        { weekRange: [11, 11], setsReps: '2x4', intensity: 0.76 },
        { weekRange: [12, 12], setsReps: '6x5', intensity: 0.65 },
        { weekRange: [13, 13], setsReps: '6x5', intensity: 0.68 },
        { weekRange: [14, 14], setsReps: '4x4', intensity: 0.72 },
        { weekRange: [15, 15], setsReps: '3x3', intensity: 0.76 },
        { weekRange: [16, 16], setsReps: '2x2', intensity: 0.82 },
      ],
    },
    {
      id: '3ct-pause-bench',
      name: '3ct Pause Bench',
      setsReps: '3x5',
      mainLift: 'bench',
      weekVariations: [
        { weekRange: [1, 1], setsReps: '3x5', intensity: 0.60 },
        { weekRange: [2, 2], setsReps: '3x6', intensity: 0.60 },
        { weekRange: [3, 3], setsReps: '3x4', intensity: 0.65 },
        { weekRange: [4, 4], setsReps: '3x3', intensity: 0.70 },
      ],
    },
    {
      id: '2ct-pause-bench-day2',
      name: '2ct Pause Bench',
      setsReps: '3x4',
      mainLift: 'bench',
      percentageOfMain: 0.75, // ~75% of bench TM
      weekVariations: [
        { weekRange: [5, 5], setsReps: '3x4', intensity: 0.75 },
        { weekRange: [6, 6], setsReps: '4x3', intensity: 0.78 },
        { weekRange: [7, 7], setsReps: '3x3', intensity: 0.80 },
        { weekRange: [8, 8], setsReps: '4x4', intensity: 0.75 },
        { weekRange: [12, 12], setsReps: '3x4', intensity: 0.75 },
        { weekRange: [13, 13], setsReps: '3x5', intensity: 0.72 },
        { weekRange: [14, 14], setsReps: '3x2', intensity: 0.80 },
        { weekRange: [15, 15], setsReps: '3x4', intensity: 0.75 },
      ],
    },
    {
      id: 'ssb-pause-squat',
      name: 'SSB/Front/High Bar Pause Squat',
      setsReps: '3x5',
      mainLift: 'squat',
      percentageOfMain: 0.65, // ~65% of squat TM (lighter due to pause + variation)
      weekVariations: [
        { weekRange: [1, 1], setsReps: '3x5', intensity: 0.65 },
        { weekRange: [2, 2], setsReps: '3x6', intensity: 0.62 },
        { weekRange: [3, 3], setsReps: '3x4', intensity: 0.68 },
        { weekRange: [4, 4], setsReps: '3x5', intensity: 0.65 },
      ],
    },
    {
      id: 'comp-squat-day2',
      name: 'Competition Squat',
      setsReps: '2x5',
      mainLift: 'squat',
      weekVariations: [
        { weekRange: [5, 5], setsReps: '2x5', intensity: 0.65 },
        { weekRange: [6, 6], setsReps: '3x5', intensity: 0.68 },
        { weekRange: [7, 7], setsReps: '2x5', intensity: 0.71 },
        { weekRange: [8, 8], setsReps: '2x4', intensity: 0.74 },
        { weekRange: [9, 9], setsReps: '3x5', intensity: 0.68 },
        { weekRange: [10, 10], setsReps: '3x5', intensity: 0.71 },
        { weekRange: [11, 11], setsReps: '3x4', intensity: 0.74 },
      ],
    },
    {
      id: 'pendlay-row',
      name: 'Pendlay Row',
      setsReps: '5x8',
      mainLift: 'bench',
      percentageOfMain: 0.60, // ~60% of bench TM
      weekVariations: [
        { weekRange: [1, 4], setsReps: '5x8', intensity: 0.60 },
        { weekRange: [5, 6], setsReps: '4x10', intensity: 0.55 },
        { weekRange: [7, 11], setsReps: '4x8', intensity: 0.60 },
      ],
    },
    {
      id: 'pin-press',
      name: 'Pin Press (chest level)',
      setsReps: '4x4',
      mainLift: 'bench',
      percentageOfMain: 0.80, // ~80% of bench TM
      weekVariations: [
        { weekRange: [9, 9], setsReps: '4x4', intensity: 0.80 },
        { weekRange: [10, 10], setsReps: '4x5', intensity: 0.75 },
        { weekRange: [11, 11], setsReps: '4x3', intensity: 0.82 },
      ],
    },
    {
      id: 'high-bar-squat',
      name: 'High Bar Squat',
      setsReps: '3x4',
      mainLift: 'squat',
      percentageOfMain: 0.70, // ~70% of squat TM
      weekVariations: [
        { weekRange: [12, 12], setsReps: '3x4', intensity: 0.70 },
        { weekRange: [13, 13], setsReps: '2x3', intensity: 0.75 },
        { weekRange: [14, 14], setsReps: '3x4', intensity: 0.70 },
        { weekRange: [15, 15], setsReps: '2x2', intensity: 0.78 },
      ],
    },
    {
      id: 'plank-day2',
      name: 'Plank (seconds)',
      setsReps: '3x60',
      isRPE: true,
      weekVariations: [
        { weekRange: [1, 8], setsReps: '3x60' },
        { weekRange: [9, 11], setsReps: '3x45' },
      ],
    },
  ],
};

// Day 3 Template - Squat Variation & Bench Volume
const DAY3_TEMPLATE: WorkoutTemplate = {
  id: 'day-3',
  phaseNumber: 1,
  dayLabel: '3',
  name: 'PAUSE SQUAT & BENCH',
  exercises: [
    {
      id: 'pin-squat',
      name: 'Pin Squat (full depth)',
      setsReps: '3x6',
      mainLift: 'squat',
      weekVariations: [
        { weekRange: [1, 1], setsReps: '3x6', intensity: 0.65 },
        { weekRange: [2, 2], setsReps: '3x5', intensity: 0.70 },
        { weekRange: [3, 3], setsReps: '3x6', intensity: 0.68 },
        { weekRange: [4, 4], setsReps: '3x5', intensity: 0.73 },
        { weekRange: [12, 12], setsReps: '1x3', intensity: 0.85 },
        { weekRange: [13, 13], setsReps: '1x2', intensity: 0.85 },
        { weekRange: [14, 14], setsReps: '1x1', intensity: 0.88 },
        { weekRange: [15, 15], setsReps: '1x1', intensity: 0.88 },
      ],
    },
    {
      id: 'pin-squat-backoff',
      name: 'Pin Squat (Backoff)',
      setsReps: '2x4',
      mainLift: 'squat',
      percentageOfMain: 0.70, // ~70% of squat TM
      weekVariations: [
        { weekRange: [12, 12], setsReps: '2x4', intensity: 0.70 },
        { weekRange: [13, 13], setsReps: '2x5', intensity: 0.68 },
        { weekRange: [14, 14], setsReps: '2x2', intensity: 0.75 },
        { weekRange: [15, 15], setsReps: '3x4', intensity: 0.70 },
      ],
    },
    {
      id: '2ct-pause-squat',
      name: '2ct Pause Squat',
      setsReps: '4x4',
      mainLift: 'squat',
      percentageOfMain: 0.70, // ~70% of squat TM
      weekVariations: [
        { weekRange: [5, 5], setsReps: '4x4', intensity: 0.70 },
        { weekRange: [6, 6], setsReps: '5x3', intensity: 0.73 },
        { weekRange: [7, 7], setsReps: '4x5', intensity: 0.68 },
        { weekRange: [8, 8], setsReps: '4x2', intensity: 0.78 },
        { weekRange: [9, 9], setsReps: '3x4', intensity: 0.72 },
        { weekRange: [10, 10], setsReps: '4x2', intensity: 0.78 },
        { weekRange: [11, 11], setsReps: '2x3', intensity: 0.75 },
      ],
    },
    {
      id: '2board-press',
      name: '2-Board Press',
      setsReps: '3x6',
      mainLift: 'bench',
      percentageOfMain: 0.85, // ~85% of bench TM (shorter ROM allows heavier weight)
      weekVariations: [
        { weekRange: [1, 1], setsReps: '3x6', intensity: 0.85 },
        { weekRange: [2, 2], setsReps: '3x5', intensity: 0.88 },
        { weekRange: [3, 3], setsReps: '3x4', intensity: 0.90 },
        { weekRange: [4, 4], setsReps: '3x6', intensity: 0.85 },
      ],
    },
    {
      id: 'comp-pause-bench-day3',
      name: 'Competition Pause Bench',
      setsReps: '6x5',
      mainLift: 'bench',
      weekVariations: [
        { weekRange: [5, 5], setsReps: '6x5', intensity: 0.70 },
        { weekRange: [6, 6], setsReps: '6x4', intensity: 0.73 },
        { weekRange: [7, 7], setsReps: '6x3', intensity: 0.75 },
        { weekRange: [8, 8], setsReps: '6x5', intensity: 0.68 },
        { weekRange: [9, 9], setsReps: '6x5', intensity: 0.72 },
        { weekRange: [10, 10], setsReps: '6x4', intensity: 0.75 },
        { weekRange: [11, 11], setsReps: '5x3', intensity: 0.78 },
      ],
    },
    {
      id: 'close-grip-bench-day3',
      name: 'Close Grip Bench Press',
      setsReps: '3x4',
      mainLift: 'bench',
      percentageOfMain: 0.82, // ~82% of bench TM
      weekVariations: [
        { weekRange: [9, 9], setsReps: '3x4', intensity: 0.82 },
        { weekRange: [10, 10], setsReps: '2x3', intensity: 0.85 },
        { weekRange: [11, 11], setsReps: '2x2', intensity: 0.88 },
        { weekRange: [12, 12], setsReps: '3x3', intensity: 0.85 },
        { weekRange: [13, 13], setsReps: '2x2', intensity: 0.88 },
        { weekRange: [14, 14], setsReps: '2x3', intensity: 0.85 },
        { weekRange: [15, 15], setsReps: '2x4', intensity: 0.82 },
      ],
    },
    {
      id: 'feet-up-bench',
      name: 'Feet Up Bench',
      setsReps: '4x5',
      mainLift: 'bench',
      percentageOfMain: 0.75, // ~75% of bench TM (less stable = lighter)
      weekVariations: [
        { weekRange: [5, 5], setsReps: '4x5', intensity: 0.75 },
        { weekRange: [6, 6], setsReps: '3x4', intensity: 0.78 },
        { weekRange: [7, 7], setsReps: '4x3', intensity: 0.80 },
        { weekRange: [8, 8], setsReps: '4x4', intensity: 0.77 },
        { weekRange: [12, 12], setsReps: '2x5', intensity: 0.75 },
        { weekRange: [13, 13], setsReps: '2x6', intensity: 0.72 },
        { weekRange: [14, 14], setsReps: '2x3', intensity: 0.80 },
        { weekRange: [15, 15], setsReps: '2x4', intensity: 0.77 },
      ],
    },
    {
      id: 'comp-deadlift-day3',
      name: 'Competition Deadlift',
      setsReps: '2x5',
      mainLift: 'deadlift',
      weekVariations: [
        { weekRange: [5, 5], setsReps: '2x5', intensity: 0.65 },
        { weekRange: [6, 6], setsReps: '3x5', intensity: 0.68 },
        { weekRange: [7, 7], setsReps: '2x5', intensity: 0.71 },
        { weekRange: [8, 8], setsReps: '2x4', intensity: 0.74 },
        { weekRange: [9, 9], setsReps: '2x5', intensity: 0.68 },
        { weekRange: [10, 10], setsReps: '3x5', intensity: 0.71 },
        { weekRange: [11, 11], setsReps: '3x4', intensity: 0.74 },
      ],
    },
    {
      id: '1arm-db-rows-day3',
      name: '1-Arm DB Rows',
      setsReps: '5x10',
      isRPE: true,
      weekVariations: [
        { weekRange: [1, 2], setsReps: '5x10' },
        { weekRange: [3, 4], setsReps: '5x8' },
      ],
    },
    {
      id: 'birddogs',
      name: 'Birddogs (per side)',
      setsReps: '3x6',
      weekVariations: [
        { weekRange: [1, 2], setsReps: '3x6' },
        { weekRange: [3, 3], setsReps: '3x8' },
        { weekRange: [4, 4], setsReps: '4x8' },
      ],
    },
    {
      id: 'vertical-pull-day3',
      name: 'Pull-ups',
      setsReps: '4x10',
      isRPE: true,
      weekVariations: [
        { weekRange: [5, 6], setsReps: '4x10' },
        { weekRange: [7, 11], setsReps: '4x8' },
      ],
    },
  ],
};

// Day 4 Template - Deadlift Variation & Bench Volume
const DAY4_TEMPLATE: WorkoutTemplate = {
  id: 'day-4',
  phaseNumber: 1,
  dayLabel: '4',
  name: 'PAUSE DEADLIFT & BENCH',
  exercises: [
    {
      id: '2ct-pause-deadlift',
      name: '2ct Pause Deadlift (off floor)',
      setsReps: '3x6',
      mainLift: 'deadlift',
      weekVariations: [
        { weekRange: [1, 1], setsReps: '3x6', intensity: 0.63 },
        { weekRange: [2, 2], setsReps: '3x5', intensity: 0.65 },
        { weekRange: [3, 3], setsReps: '3x6', intensity: 0.68 },
        { weekRange: [4, 4], setsReps: '3x5', intensity: 0.73 },
        { weekRange: [12, 12], setsReps: '1x3', intensity: 0.85 },
        { weekRange: [13, 13], setsReps: '1x2', intensity: 0.85 },
        { weekRange: [14, 14], setsReps: '1x1', intensity: 0.88 },
        { weekRange: [15, 15], setsReps: '1x1', intensity: 0.88 },
      ],
    },
    {
      id: '2ct-pause-deadlift-rpe',
      name: '2ct Pause Deadlift',
      setsReps: '4x4',
      mainLift: 'deadlift',
      percentageOfMain: 0.70, // ~70% of deadlift TM
      weekVariations: [
        { weekRange: [5, 5], setsReps: '4x4', intensity: 0.70 },
        { weekRange: [6, 6], setsReps: '5x3', intensity: 0.73 },
        { weekRange: [7, 7], setsReps: '4x5', intensity: 0.68 },
        { weekRange: [8, 8], setsReps: '4x2', intensity: 0.78 },
        { weekRange: [9, 9], setsReps: '3x4', intensity: 0.72 },
        { weekRange: [10, 10], setsReps: '4x2', intensity: 0.78 },
        { weekRange: [11, 11], setsReps: '2x3', intensity: 0.75 },
        { weekRange: [12, 12], setsReps: '3x5', intensity: 0.68 },
        { weekRange: [13, 13], setsReps: '3x4', intensity: 0.72 },
        { weekRange: [14, 14], setsReps: '3x2', intensity: 0.78 },
        { weekRange: [15, 15], setsReps: '3x4', intensity: 0.72 },
      ],
    },
    {
      id: 'rep-bench',
      name: 'Touch and Go Bench',
      setsReps: '4x10',
      mainLift: 'bench',
      weekVariations: [
        { weekRange: [1, 2], setsReps: '4x10', intensity: 0.63 },
        { weekRange: [3, 3], setsReps: '4x10', intensity: 0.68 },
        { weekRange: [4, 4], setsReps: '4x8', intensity: 0.70 },
      ],
    },
    {
      id: 'touch-go-bench-rpe',
      name: 'Touch and Go Bench',
      setsReps: '3x6',
      mainLift: 'bench',
      percentageOfMain: 0.75, // ~75% of bench TM
      weekVariations: [
        { weekRange: [5, 5], setsReps: '3x6', intensity: 0.75 },
        { weekRange: [6, 6], setsReps: '3x12', intensity: 0.60 },
        { weekRange: [7, 7], setsReps: '4x7', intensity: 0.70 },
        { weekRange: [8, 8], setsReps: '4x5', intensity: 0.75 },
        { weekRange: [12, 12], setsReps: '4x5', intensity: 0.75 },
        { weekRange: [13, 13], setsReps: '4x4', intensity: 0.78 },
        { weekRange: [14, 14], setsReps: '2x3', intensity: 0.82 },
        { weekRange: [15, 15], setsReps: '3x3', intensity: 0.80 },
      ],
    },
    {
      id: 'sldl-day4',
      name: 'SLDL',
      setsReps: '3x8',
      mainLift: 'deadlift',
      weekVariations: [
        { weekRange: [1, 1], setsReps: '3x8', intensity: 0.40 },
        { weekRange: [2, 2], setsReps: '3x8', intensity: 0.43 },
        { weekRange: [3, 3], setsReps: '3x6', intensity: 0.45 },
        { weekRange: [4, 4], setsReps: '3x6', intensity: 0.48 },
      ],
    },
    {
      id: 'vertical-pull-day4',
      name: 'Pull-ups',
      setsReps: '4x10',
      isRPE: true,
      weekVariations: [
        { weekRange: [1, 2], setsReps: '4x10' },
        { weekRange: [3, 4], setsReps: '4x8' },
      ],
    },
    {
      id: 'tricep-movement',
      name: 'Close Grip Bench Press',
      setsReps: '4x10',
      mainLift: 'bench',
      percentageOfMain: 0.65, // ~65% of bench TM
      weekVariations: [
        { weekRange: [1, 2], setsReps: '4x10', intensity: 0.65 },
        { weekRange: [3, 4], setsReps: '4x8', intensity: 0.70 },
      ],
    },
    {
      id: 'close-grip-incline',
      name: 'Close Grip Incline Press',
      setsReps: '4x8',
      mainLift: 'bench',
      percentageOfMain: 0.65, // ~65% of bench TM (incline + close grip = lighter)
      weekVariations: [
        { weekRange: [5, 5], setsReps: '4x8', intensity: 0.65 },
        { weekRange: [6, 6], setsReps: '4x7', intensity: 0.68 },
        { weekRange: [7, 7], setsReps: '5x6', intensity: 0.70 },
        { weekRange: [8, 8], setsReps: '4x10', intensity: 0.62 },
      ],
    },
    {
      id: '1arm-db-rows-day4',
      name: '1-Arm DB Rows',
      setsReps: '6x10',
      isRPE: true,
      weekVariations: [
        { weekRange: [5, 6], setsReps: '6x10' },
        { weekRange: [7, 11], setsReps: '5x8' },
      ],
    },
    {
      id: 'bench-mini-bands',
      name: 'Bench + Mini Bands',
      setsReps: '2x8',
      mainLift: 'bench',
      percentageOfMain: 0.65, // ~65% of bench TM (bands add resistance)
      weekVariations: [
        { weekRange: [9, 9], setsReps: '2x8', intensity: 0.65 },
        { weekRange: [10, 10], setsReps: '2x7', intensity: 0.68 },
        { weekRange: [11, 11], setsReps: '2x6', intensity: 0.70 },
      ],
    },
    {
      id: 'barbell-ohp',
      name: 'Barbell Overhead Press',
      setsReps: '4x7',
      mainLift: 'bench',
      percentageOfMain: 0.50, // ~50% of bench TM
      weekVariations: [
        { weekRange: [9, 9], setsReps: '4x7', intensity: 0.50 },
        { weekRange: [10, 10], setsReps: '3x8', intensity: 0.48 },
        { weekRange: [11, 11], setsReps: '2x5', intensity: 0.55 },
      ],
    },
    {
      id: 'plank',
      name: 'Plank (seconds)',
      setsReps: '3x60',
      isRPE: true,
      weekVariations: [
        { weekRange: [1, 8], setsReps: '3x60' },
        { weekRange: [9, 11], setsReps: '3x45' },
        { weekRange: [12, 15], setsReps: '2x60' },
      ],
    },
  ],
};

// All templates - used for seeding
export const ALL_TEMPLATES = [DAY1_TEMPLATE, DAY2_TEMPLATE, DAY3_TEMPLATE, DAY4_TEMPLATE];

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

// Check if week is a deload (not used in this program)
export function isDeloadWeek(week: number): boolean {
  return DELOAD_WEEKS.includes(week);
}

// Get template for a specific day
export function getTemplate(phaseNumber: number, dayLabel: string): WorkoutTemplate | undefined {
  // In this program, templates are the same across phases, just use day label
  return ALL_TEMPLATES.find(t => t.dayLabel === dayLabel);
}

// Re-export MainLift type for convenience
export type { MainLift };
