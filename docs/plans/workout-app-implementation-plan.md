# Workout Tracker App - Implementation Plan

## Overview

A mobile-first workout tracking app for a 26-week powerlifting program. Single user, no authentication. Built with Next.js 14 (App Router), React, Tailwind CSS, shadcn/ui, and Turso (SQLite) for persistence.

---

## Program Structure (from CSV)

### Phases

| Phase | Name | Weeks | Days/Week | Labels |
|-------|------|-------|-----------|--------|
| 1 | Foundation | 1-8 | 3 | A, B, C |
| 2 | Strength Building | 9-20 | 4 | 1, 2, 3, 4 |
| 3 | Peaking | 21-26 | 3 | 1, 2, 3 |

### Weight Progression

- **Linear progression**: +2.5kg per week for all main lifts
- **Deload weeks**: 13, 17, 25 (60% of working weight)
- **Test week**: 26

### Starting Weights (Week 1 defaults)

| Lift | Weight (kg) |
|------|-------------|
| Squat | 52.5 |
| Bench | 37.5 |
| Deadlift | 55 |
| RDL | 42.5 |
| OHP | 27.5 |

---

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Turso (libSQL) with Drizzle ORM
- **Hosting**: Vercel (free tier)
- **Charts**: Recharts (for progress visualization)

---

## Core Features

1. **Dashboard** - Shows current week, today's workout, quick start
2. **Workout Logger** - Log sets/reps/weights for each exercise
3. **Workout Calendar** - View all 26 weeks, see completion status
4. **Template Editor** - Edit workout templates, changes propagate to future workouts
5. **Progress View** - Weight progression charts
6. **Settings** - Adjust starting weights, weekly increment

---

## File Structure

```
workout-tracker/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Dashboard
│   │   ├── workouts/
│   │   │   ├── page.tsx                # Calendar/list view
│   │   │   └── [weekNumber]/
│   │   │       └── [dayLabel]/
│   │   │           └── page.tsx        # Workout logger
│   │   ├── templates/
│   │   │   ├── page.tsx                # List templates
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Edit template
│   │   ├── progress/
│   │   │   └── page.tsx                # Charts
│   │   ├── settings/
│   │   │   └── page.tsx                # Config
│   │   └── api/
│   │       └── seed/
│   │           └── route.ts            # One-time DB seed
│   │
│   ├── components/
│   │   ├── ui/                         # shadcn components
│   │   ├── bottom-nav.tsx
│   │   ├── workout-card.tsx
│   │   ├── exercise-logger.tsx
│   │   ├── set-input.tsx
│   │   ├── weight-adjuster.tsx
│   │   ├── week-selector.tsx
│   │   └── phase-badge.tsx
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts                # DB client
│   │   │   ├── schema.ts               # Drizzle schema
│   │   │   └── queries.ts              # Query functions
│   │   ├── weight-calculator.ts
│   │   ├── program-data.ts             # Hardcoded program structure
│   │   └── utils.ts
│   │
│   └── types/
│       └── index.ts
│
├── drizzle.config.ts
├── .env.local                          # TURSO_DATABASE_URL, TURSO_AUTH_TOKEN
└── package.json
```

---

## Database Schema

```typescript
// src/lib/db/schema.ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Program configuration (single row for single user)
export const config = sqliteTable('config', {
  id: text('id').primaryKey().default('default'),
  programStartDate: text('program_start_date'),
  startingSquat: real('starting_squat').notNull().default(52.5),
  startingBench: real('starting_bench').notNull().default(37.5),
  startingDeadlift: real('starting_deadlift').notNull().default(55),
  startingRdl: real('starting_rdl').notNull().default(42.5),
  startingOhp: real('starting_ohp').notNull().default(27.5),
  weeklyIncrement: real('weekly_increment').notNull().default(2.5),
  deloadPercentage: real('deload_percentage').notNull().default(0.6),
  currentWeek: integer('current_week').notNull().default(1),
});

// Workout templates (seeded from program data, editable)
export const workoutTemplates = sqliteTable('workout_templates', {
  id: text('id').primaryKey(),
  phaseNumber: integer('phase_number').notNull(),
  dayLabel: text('day_label').notNull(),
  name: text('name').notNull(),
  exercisesJson: text('exercises_json').notNull(),
});

// Completed workouts (only created when user logs a workout)
export const completedWorkouts = sqliteTable('completed_workouts', {
  id: text('id').primaryKey(),
  weekNumber: integer('week_number').notNull(),
  phaseNumber: integer('phase_number').notNull(),
  dayLabel: text('day_label').notNull(),
  templateId: text('template_id').notNull(),
  completedAt: text('completed_at').notNull(),
  exerciseLogsJson: text('exercise_logs_json').notNull(),
  notes: text('notes'),
});
```

---

## Program Data

### Constants

```typescript
// src/lib/program-data.ts

export const PHASES = [
  { number: 1, name: 'Foundation', startWeek: 1, endWeek: 8, daysPerWeek: 3, labels: ['A', 'B', 'C'] },
  { number: 2, name: 'Strength Building', startWeek: 9, endWeek: 20, daysPerWeek: 4, labels: ['1', '2', '3', '4'] },
  { number: 3, name: 'Peaking', startWeek: 21, endWeek: 26, daysPerWeek: 3, labels: ['1', '2', '3'] },
] as const;

export const DELOAD_WEEKS = [13, 17, 25] as const;
export const TEST_WEEK = 26;

export type MainLift = 'squat' | 'bench' | 'deadlift' | 'rdl' | 'ohp';
```

### Template Exercise Interface

```typescript
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
```

### Phase 1 Templates

```typescript
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
        mainLift: 'rdl',
        weekVariations: [
          { weekRange: [1, 4], setsReps: '3x12' },
          { weekRange: [5, 8], setsReps: '3x8' },
        ]
      },
      { id: 'shoulder-press', name: 'Shoulder Press', setsReps: '3x10', mainLift: 'ohp' },
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
```

### Phase 2 Templates

```typescript
export const PHASE2_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'phase2-1',
    phaseNumber: 2,
    dayLabel: '1',
    name: 'SQUAT FOCUS',
    exercises: [
      { id: 'back-squat', name: 'Back Squat', setsReps: '5x5', mainLift: 'squat' },
      { id: 'front-squat', name: 'Front Squat', setsReps: '3x8', mainLift: 'squat', percentageOfMain: 0.65 },
      { id: 'rdl', name: 'Romanian Deadlift', setsReps: '3x10', mainLift: 'rdl' },
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
      { id: 'shoulder-press', name: 'Shoulder Press', setsReps: '3x10', mainLift: 'ohp' },
    ],
  },
];
```

### Phase 3 Templates

```typescript
export const PHASE3_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'phase3-1',
    phaseNumber: 3,
    dayLabel: '1',
    name: 'HEAVY SQUAT',
    exercises: [
      { id: 'back-squat', name: 'Back Squat', setsReps: '3x3', mainLift: 'squat' },
      { id: 'front-squat', name: 'Front Squat', setsReps: '3x5', mainLift: 'squat', percentageOfMain: 0.60 },
      { id: 'rdl', name: 'RDL', setsReps: '3x8', mainLift: 'rdl' },
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
```

### Helper Functions

```typescript
// Get phase for a given week
export function getPhaseForWeek(week: number) {
  return PHASES.find(p => week >= p.startWeek && week <= p.endWeek)!;
}

// Get workout labels for a given week
export function getWorkoutsForWeek(week: number): string[] {
  const phase = getPhaseForWeek(week);
  return [...phase.labels];
}

// Check if week is a deload
export function isDeloadWeek(week: number): boolean {
  return DELOAD_WEEKS.includes(week as any);
}

// Get template for a specific phase and day
export function getTemplate(phaseNumber: number, dayLabel: string): WorkoutTemplate | undefined {
  return ALL_TEMPLATES.find(t => t.phaseNumber === phaseNumber && t.dayLabel === dayLabel);
}
```

---

## Weight Calculator

```typescript
// src/lib/weight-calculator.ts
import { DELOAD_WEEKS, MainLift } from './program-data';

interface Config {
  startingSquat: number;
  startingBench: number;
  startingDeadlift: number;
  startingRdl: number;
  startingOhp: number;
  weeklyIncrement: number;
  deloadPercentage: number;
}

const LIFT_TO_CONFIG_KEY: Record<MainLift, keyof Config> = {
  squat: 'startingSquat',
  bench: 'startingBench',
  deadlift: 'startingDeadlift',
  rdl: 'startingRdl',
  ohp: 'startingOhp',
};

export function calculateWeight(
  mainLift: MainLift,
  weekNumber: number,
  config: Config,
  percentageOfMain: number = 1
): number {
  const startWeight = config[LIFT_TO_CONFIG_KEY[mainLift]] as number;
  const { weeklyIncrement, deloadPercentage } = config;

  // Count progression weeks (excluding deloads before this week)
  let progressionWeeks = weekNumber - 1;
  for (const deloadWeek of DELOAD_WEEKS) {
    if (deloadWeek < weekNumber) {
      progressionWeeks--;
    }
  }

  // Base weight with linear progression
  let weight = startWeight + progressionWeeks * weeklyIncrement;

  // Apply deload if this is a deload week
  if (DELOAD_WEEKS.includes(weekNumber as typeof DELOAD_WEEKS[number])) {
    weight = weight * deloadPercentage;
  }

  // Apply percentage modifier for accessory lifts
  weight = weight * percentageOfMain;

  // Round to nearest 2.5kg
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
    rdl: calculateWeight('rdl', weekNumber, config),
    ohp: calculateWeight('ohp', weekNumber, config),
  };
}

// Get sets/reps for an exercise based on week (handles week variations)
export function getSetsRepsForWeek(
  exercise: { setsReps: string; weekVariations?: { weekRange: [number, number]; setsReps: string }[] },
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
```

---

## UI Components

### Bottom Navigation

```typescript
// src/components/bottom-nav.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, TrendingUp, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Today' },
  { href: '/workouts', icon: Calendar, label: 'Workouts' },
  { href: '/progress', icon: TrendingUp, label: 'Progress' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function BottomNav() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t safe-area-pb">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

### Exercise Logger Component

```typescript
// src/components/exercise-logger.tsx
'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Minus, Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface CompletedSet {
  reps: number;
  weight: number;
  completed: boolean;
}

interface Props {
  exerciseName: string;
  plannedSets: number;
  plannedReps: string;
  plannedWeight: number | null;
  initialSets?: CompletedSet[];
  onUpdate: (sets: CompletedSet[]) => void;
}

export function ExerciseLogger({ 
  exerciseName, 
  plannedSets, 
  plannedReps, 
  plannedWeight, 
  initialSets,
  onUpdate 
}: Props) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [sets, setSets] = useState<CompletedSet[]>(() =>
    initialSets || Array.from({ length: plannedSets }, () => ({
      reps: parseInt(plannedReps) || 0,
      weight: plannedWeight || 0,
      completed: false,
    }))
  );

  const completedCount = sets.filter(s => s.completed).length;

  const updateSet = (index: number, updates: Partial<CompletedSet>) => {
    const newSets = sets.map((set, i) => (i === index ? { ...set, ...updates } : set));
    setSets(newSets);
    onUpdate(newSets);
  };

  const adjustWeight = (index: number, delta: number) => {
    updateSet(index, { weight: Math.max(0, sets[index].weight + delta) });
  };

  const adjustReps = (index: number, delta: number) => {
    updateSet(index, { reps: Math.max(0, sets[index].reps + delta) });
  };

  return (
    <Card className="overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex justify-between items-center text-left"
      >
        <div>
          <h3 className="font-semibold">{exerciseName}</h3>
          <span className="text-sm text-muted-foreground">
            {plannedSets}x{plannedReps} {plannedWeight ? `@ ${plannedWeight}kg` : ''}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${completedCount === plannedSets ? 'text-green-600' : ''}`}>
            {completedCount}/{plannedSets}
          </span>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </button>

      {/* Expandable sets */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {sets.map((set, i) => (
            <div 
              key={i} 
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                set.completed ? 'bg-green-50 dark:bg-green-950' : 'bg-muted/50'
              }`}
            >
              <span className="w-8 text-sm text-muted-foreground font-medium">#{i + 1}</span>
              
              {/* Weight controls */}
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => adjustWeight(i, -2.5)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-20 text-center">
                  <Input
                    type="number"
                    step="2.5"
                    value={set.weight}
                    onChange={(e) => updateSet(i, { weight: parseFloat(e.target.value) || 0 })}
                    className="h-10 text-center font-medium"
                  />
                  <span className="text-xs text-muted-foreground">kg</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => adjustWeight(i, 2.5)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <span className="text-muted-foreground">×</span>

              {/* Reps controls */}
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => adjustReps(i, -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-14 text-center">
                  <Input
                    type="number"
                    value={set.reps}
                    onChange={(e) => updateSet(i, { reps: parseInt(e.target.value) || 0 })}
                    className="h-10 text-center font-medium"
                  />
                  <span className="text-xs text-muted-foreground">reps</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => adjustReps(i, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Complete button */}
              <Button
                variant={set.completed ? 'default' : 'outline'}
                size="icon"
                className="h-10 w-10 ml-auto"
                onClick={() => updateSet(i, { completed: !set.completed })}
              >
                <Check className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
```

### Phase Badge Component

```typescript
// src/components/phase-badge.tsx
import { DELOAD_WEEKS } from '@/lib/program-data';

interface Props {
  phaseNumber: number;
  phaseName: string;
  weekNumber: number;
}

export function PhaseBadge({ phaseNumber, phaseName, weekNumber }: Props) {
  const isDeload = DELOAD_WEEKS.includes(weekNumber as any);
  
  return (
    <div className="flex items-center gap-2">
      <span className={`
        px-2 py-1 rounded-full text-xs font-medium
        ${phaseNumber === 1 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
        ${phaseNumber === 2 ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : ''}
        ${phaseNumber === 3 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : ''}
      `}>
        Phase {phaseNumber}: {phaseName}
      </span>
      {isDeload && (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          Deload
        </span>
      )}
    </div>
  );
}
```

### Workout Card Component

```typescript
// src/components/workout-card.tsx
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

interface Props {
  weekNumber: number;
  dayLabel: string;
  workoutName: string;
  exerciseCount: number;
  isCompleted: boolean;
  isCurrentDay?: boolean;
}

export function WorkoutCard({ 
  weekNumber, 
  dayLabel, 
  workoutName, 
  exerciseCount, 
  isCompleted,
  isCurrentDay 
}: Props) {
  return (
    <Link href={`/workouts/${weekNumber}/${dayLabel}`}>
      <Card className={`p-4 transition-all hover:shadow-md ${
        isCurrentDay ? 'ring-2 ring-primary' : ''
      } ${isCompleted ? 'bg-green-50 dark:bg-green-950/30' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isCompleted ? (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            ) : (
              <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30" />
            )}
            <div>
              <h3 className="font-semibold">Day {dayLabel}</h3>
              <p className="text-sm text-muted-foreground">{workoutName}</p>
              <p className="text-xs text-muted-foreground">{exerciseCount} exercises</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </Card>
    </Link>
  );
}
```

---

## Server Actions

```typescript
// src/app/actions.ts
'use server';

import { db } from '@/lib/db';
import { config, completedWorkouts, workoutTemplates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Get app configuration
export async function getConfig() {
  const results = await db.select().from(config);
  if (results.length === 0) {
    // Insert default config if none exists
    await db.insert(config).values({ id: 'default' });
    return (await db.select().from(config))[0];
  }
  return results[0];
}

// Update configuration
export async function updateConfig(updates: Partial<typeof config.$inferInsert>) {
  await db.update(config).set(updates).where(eq(config.id, 'default'));
  revalidatePath('/');
  revalidatePath('/settings');
}

// Save completed workout
export async function saveWorkout(data: {
  weekNumber: number;
  phaseNumber: number;
  dayLabel: string;
  templateId: string;
  exerciseLogs: Array<{
    exerciseId: string;
    exerciseName: string;
    sets: Array<{ reps: number; weight: number; completed: boolean }>;
  }>;
  notes?: string;
}) {
  const id = `week-${data.weekNumber}-day-${data.dayLabel}`;
  
  await db.insert(completedWorkouts).values({
    id,
    weekNumber: data.weekNumber,
    phaseNumber: data.phaseNumber,
    dayLabel: data.dayLabel,
    templateId: data.templateId,
    completedAt: new Date().toISOString(),
    exerciseLogsJson: JSON.stringify(data.exerciseLogs),
    notes: data.notes,
  }).onConflictDoUpdate({
    target: completedWorkouts.id,
    set: {
      exerciseLogsJson: JSON.stringify(data.exerciseLogs),
      completedAt: new Date().toISOString(),
      notes: data.notes,
    },
  });
  
  revalidatePath('/');
  revalidatePath('/workouts');
  revalidatePath(`/workouts/${data.weekNumber}/${data.dayLabel}`);
}

// Get all completed workouts
export async function getCompletedWorkouts() {
  return db.select().from(completedWorkouts);
}

// Get specific completed workout
export async function getCompletedWorkout(weekNumber: number, dayLabel: string) {
  const id = `week-${weekNumber}-day-${dayLabel}`;
  const results = await db.select().from(completedWorkouts).where(eq(completedWorkouts.id, id));
  return results[0] || null;
}

// Update workout template
export async function updateTemplate(id: string, exercisesJson: string) {
  await db.update(workoutTemplates)
    .set({ exercisesJson })
    .where(eq(workoutTemplates.id, id));
  revalidatePath('/templates');
  revalidatePath('/workouts');
}

// Get all templates
export async function getTemplates() {
  return db.select().from(workoutTemplates);
}

// Seed database with initial data
export async function seedDatabase() {
  const { ALL_TEMPLATES } = await import('@/lib/program-data');
  
  // Insert default config
  await db.insert(config).values({ id: 'default' }).onConflictDoNothing();
  
  // Insert all templates
  for (const template of ALL_TEMPLATES) {
    await db.insert(workoutTemplates).values({
      id: template.id,
      phaseNumber: template.phaseNumber,
      dayLabel: template.dayLabel,
      name: template.name,
      exercisesJson: JSON.stringify(template.exercises),
    }).onConflictDoUpdate({
      target: workoutTemplates.id,
      set: {
        name: template.name,
        exercisesJson: JSON.stringify(template.exercises),
      },
    });
  }
}
```

---

## Page Implementations

### Dashboard (/)

```typescript
// src/app/page.tsx
import { getConfig, getCompletedWorkouts } from './actions';
import { getPhaseForWeek, getWorkoutsForWeek, getTemplate, isDeloadWeek } from '@/lib/program-data';
import { PhaseBadge } from '@/components/phase-badge';
import { WorkoutCard } from '@/components/workout-card';
import { getAllWeightsForWeek } from '@/lib/weight-calculator';

export default async function DashboardPage() {
  const config = await getConfig();
  const completedWorkouts = await getCompletedWorkouts();
  
  const currentWeek = config.currentWeek;
  const phase = getPhaseForWeek(currentWeek);
  const workoutLabels = getWorkoutsForWeek(currentWeek);
  const weights = getAllWeightsForWeek(currentWeek, config);
  
  const completedIds = new Set(completedWorkouts.map(w => w.id));
  
  return (
    <div className="p-4 pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Week {currentWeek} of 26</h1>
        <PhaseBadge 
          phaseNumber={phase.number} 
          phaseName={phase.name} 
          weekNumber={currentWeek} 
        />
      </div>
      
      {/* Current weights summary */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h2 className="text-sm font-medium text-muted-foreground mb-2">This Week's Working Weights</h2>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div><span className="text-muted-foreground">SQ:</span> {weights.squat}kg</div>
          <div><span className="text-muted-foreground">BP:</span> {weights.bench}kg</div>
          <div><span className="text-muted-foreground">DL:</span> {weights.deadlift}kg</div>
        </div>
      </div>
      
      {/* Workouts for this week */}
      <h2 className="text-lg font-semibold mb-3">This Week's Workouts</h2>
      <div className="space-y-3">
        {workoutLabels.map((label, index) => {
          const template = getTemplate(phase.number, label);
          const isCompleted = completedIds.has(`week-${currentWeek}-day-${label}`);
          const isCurrentDay = !isCompleted && index === workoutLabels.findIndex(
            l => !completedIds.has(`week-${currentWeek}-day-${l}`)
          );
          
          return (
            <WorkoutCard
              key={label}
              weekNumber={currentWeek}
              dayLabel={label}
              workoutName={template?.name || ''}
              exerciseCount={template?.exercises.length || 0}
              isCompleted={isCompleted}
              isCurrentDay={isCurrentDay}
            />
          );
        })}
      </div>
    </div>
  );
}
```

### Workout Logger (/workouts/[weekNumber]/[dayLabel])

```typescript
// src/app/workouts/[weekNumber]/[dayLabel]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ExerciseLogger } from '@/components/exercise-logger';
import { PhaseBadge } from '@/components/phase-badge';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

// This would be fetched from server in a real implementation
// Using client component for interactivity

export default function WorkoutLoggerPage() {
  const params = useParams();
  const router = useRouter();
  const weekNumber = parseInt(params.weekNumber as string);
  const dayLabel = params.dayLabel as string;
  
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch workout data on mount
  // ... implementation details
  
  const handleSave = async () => {
    setIsSaving(true);
    // Call server action to save
    // await saveWorkout({ ... });
    setIsSaving(false);
    router.push('/');
  };
  
  return (
    <div className="p-4 pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold">Week {weekNumber} - Day {dayLabel}</h1>
          {/* Phase badge would go here */}
        </div>
      </div>
      
      {/* Exercise list */}
      <div className="space-y-4">
        {/* Map through exercises and render ExerciseLogger components */}
      </div>
      
      {/* Save button - fixed at bottom */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background border-t">
        <div className="max-w-md mx-auto">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full"
            size="lg"
          >
            <Save className="h-5 w-5 mr-2" />
            {isSaving ? 'Saving...' : 'Save Workout'}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Settings Page (/settings)

```typescript
// src/app/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { getConfig, updateConfig } from '../actions';

export default function SettingsPage() {
  const [config, setConfig] = useState({
    currentWeek: 1,
    startingSquat: 52.5,
    startingBench: 37.5,
    startingDeadlift: 55,
    startingRdl: 42.5,
    startingOhp: 27.5,
    weeklyIncrement: 2.5,
    deloadPercentage: 0.6,
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Load config on mount
  useEffect(() => {
    getConfig().then(setConfig);
  }, []);
  
  const handleSave = async () => {
    setIsSaving(true);
    await updateConfig(config);
    setIsSaving(false);
  };
  
  return (
    <div className="p-4 pb-20 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {/* Current Week */}
      <Card className="p-4 mb-4">
        <Label htmlFor="currentWeek">Current Week</Label>
        <Input
          id="currentWeek"
          type="number"
          min={1}
          max={26}
          value={config.currentWeek}
          onChange={(e) => setConfig({ ...config, currentWeek: parseInt(e.target.value) || 1 })}
          className="mt-2"
        />
      </Card>
      
      {/* Starting Weights */}
      <Card className="p-4 mb-4">
        <h2 className="font-semibold mb-4">Starting Weights (kg)</h2>
        <div className="space-y-4">
          {[
            { key: 'startingSquat', label: 'Squat' },
            { key: 'startingBench', label: 'Bench Press' },
            { key: 'startingDeadlift', label: 'Deadlift' },
            { key: 'startingRdl', label: 'Romanian Deadlift' },
            { key: 'startingOhp', label: 'Overhead Press' },
          ].map(({ key, label }) => (
            <div key={key}>
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type="number"
                step={2.5}
                value={config[key as keyof typeof config]}
                onChange={(e) => setConfig({ ...config, [key]: parseFloat(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
          ))}
        </div>
      </Card>
      
      {/* Progression Settings */}
      <Card className="p-4 mb-6">
        <h2 className="font-semibold mb-4">Progression</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="weeklyIncrement">Weekly Increment (kg)</Label>
            <Input
              id="weeklyIncrement"
              type="number"
              step={0.5}
              value={config.weeklyIncrement}
              onChange={(e) => setConfig({ ...config, weeklyIncrement: parseFloat(e.target.value) || 2.5 })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="deloadPercentage">Deload Percentage</Label>
            <Input
              id="deloadPercentage"
              type="number"
              step={0.05}
              min={0}
              max={1}
              value={config.deloadPercentage}
              onChange={(e) => setConfig({ ...config, deloadPercentage: parseFloat(e.target.value) || 0.6 })}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {Math.round(config.deloadPercentage * 100)}% of working weight
            </p>
          </div>
        </div>
      </Card>
      
      <Button onClick={handleSave} disabled={isSaving} className="w-full">
        {isSaving ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  );
}
```

---

## Setup Instructions

### 1. Initialize Project

```bash
npx create-next-app@latest workout-tracker --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd workout-tracker
```

### 2. Install Dependencies

```bash
# UI components
npx shadcn@latest init
npx shadcn@latest add button card input label tabs dialog

# Database
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit

# Charts (for progress page)
npm install recharts

# Icons
npm install lucide-react
```

### 3. Configure Turso

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create database
turso db create workout-tracker
turso db show workout-tracker --url
turso db tokens create workout-tracker
```

### 4. Environment Variables

Create `.env.local`:

```env
TURSO_DATABASE_URL=libsql://your-db-name-your-org.turso.io
TURSO_AUTH_TOKEN=your-token-here
```

### 5. Drizzle Config

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
```

### 6. Database Client

```typescript
// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client);
```

### 7. Run Migrations

```bash
npx drizzle-kit push
```

### 8. Seed Database

Create an API route or script to call `seedDatabase()` once after deployment.

---

## Deployment to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
4. Deploy

---

## Implementation Order

1. **Project setup** - Initialize Next.js, install deps, configure Tailwind + shadcn
2. **Database** - Set up Turso, create schema, configure Drizzle
3. **Program data** - Add all template data and helper functions
4. **Weight calculator** - Implement weight calculation logic
5. **Layout + navigation** - Root layout with bottom nav
6. **Dashboard** - Current week view with workout cards
7. **Workout logger** - Core logging functionality with exercise logger component
8. **Settings page** - Configuration editing
9. **Workouts calendar** - Week overview with completion status
10. **Templates page** - View and edit templates
11. **Progress page** - Charts showing weight progression
12. **Polish** - Loading states, error handling, PWA manifest

---

## Mobile Optimizations

- Use `safe-area-inset-*` for notch/home indicator spacing
- Large touch targets (minimum 44x44px)
- Bottom navigation for thumb-friendly access
- Swipe gestures for navigating between exercises (optional enhancement)
- Pull-to-refresh on main pages
- Add PWA manifest for "Add to Home Screen" functionality

---

## Future Enhancements (Out of Scope for MVP)

- Rest timer between sets
- Exercise history/personal records
- Export data to CSV
- Backup/restore functionality
- Dark mode toggle (system preference works by default)
- Workout notes and RPE tracking
- Exercise substitution suggestions
