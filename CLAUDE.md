# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A mobile-first workout tracking app for a 26-week powerlifting program. Single user, no authentication. Tracks workouts across 3 phases with linear weight progression.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Turso (libSQL) with Drizzle ORM
- **Charts**: Recharts (for progress visualization)

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run db:push      # Push schema to Turso
npm run db:studio    # Open Drizzle Studio
```

### Database Setup

1. Install Turso CLI: `curl -sSfL https://get.tur.so/install.sh | bash`
2. Create database: `turso db create workout-tracker`
3. Get URL: `turso db show workout-tracker --url`
4. Get token: `turso db tokens create workout-tracker`
5. Add to `.env.local`
6. Push schema: `npm run db:push`
7. Seed database: `curl -X POST http://localhost:3000/api/seed`

## Architecture

### Data Flow

- **Program Data** (`src/lib/program-data.ts`): Hardcoded workout templates for all 3 phases (Foundation, Strength Building, Peaking)
- **Weight Calculator** (`src/lib/weight-calculator.ts`): Computes weights based on week number, handles deload weeks (13, 17, 25)
- **Server Actions** (`src/app/actions.ts`): All database operations (getConfig, saveWorkout, etc.)

### Key Concepts

- **Phases**: Program has 3 phases with different workout structures
  - Phase 1 (weeks 1-8): 3 days/week, labeled A/B/C
  - Phase 2 (weeks 9-20): 4 days/week, labeled 1/2/3/4
  - Phase 3 (weeks 21-26): 3 days/week, labeled 1/2/3
- **Weight Progression**: +2.5kg/week with 60% deload on weeks 13, 17, 25
- **Week Variations**: Some exercises have different sets/reps based on week ranges

### Database Schema

- `config`: Single row storing user settings (starting weights, current week)
- `workoutTemplates`: Editable workout templates seeded from program data
- `completedWorkouts`: Logged workouts with exercise details stored as JSON

## UI/UX Notes

### Mobile-First Design

- Uses `viewportFit: cover` with safe-area padding for iOS notch
- Exercise logger has compact layout for narrow screens
- Current day workout highlighted with purple border
- Dark theme with neon purple/green accent colors

### Key Features

- **Personal Records**: Progress page shows max weight achieved per exercise (sorted by weight)
- **Reset Workout**: Open a completed workout and tap the reset icon (⟲) in header to mark as not done
- **Weight Memory**: Accessory exercises remember last used weights
- **Auto Week Advance**: Current week calculated from program start date, advances every Sunday

### Pages

- `/` - Dashboard with current week's workouts
- `/workouts` - Browse all weeks
- `/workouts/[week]/[day]` - Log a specific workout
- `/progress` - Personal records + weight progression chart
- `/settings` - Set current week (adjusts program start date)
