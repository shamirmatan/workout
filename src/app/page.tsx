import { getConfig, getCompletedWorkouts } from './actions';
import { getPhaseForWeek, getWorkoutsForWeek, getTemplate } from '@/lib/program-data';
import { PhaseBadge } from '@/components/phase-badge';
import { WorkoutCard } from '@/components/workout-card';
import { getAllWeightsForWeek, isExerciseActiveForWeek } from '@/lib/weight-calculator';
import type { Config } from '@/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const configData = await getConfig();
  const completedWorkoutsData = await getCompletedWorkouts();

  // Cast to Config type
  const config: Config = {
    id: configData.id ?? 'default',
    programStartDate: configData.programStartDate,
    currentWeek: configData.currentWeek,
    startingSquat: configData.startingSquat,
    startingBench: configData.startingBench,
    startingDeadlift: configData.startingDeadlift,
    startingOhp: configData.startingOhp,
    startingRow: configData.startingRow ?? 45,
    startingLunges: configData.startingLunges ?? 40,
    startingGoodmornings: configData.startingGoodmornings ?? 30,
    startingRdl: configData.startingRdl ?? 60,
    weeklyIncrement: configData.weeklyIncrement,
    goodmorningsIncrement: configData.goodmorningsIncrement ?? 1.25,
    deloadPercentage: configData.deloadPercentage,
    squatAdjustment: configData.squatAdjustment ?? 0,
    benchAdjustment: configData.benchAdjustment ?? 0,
    deadliftAdjustment: configData.deadliftAdjustment ?? 0,
    ohpAdjustment: configData.ohpAdjustment ?? 0,
  };

  const currentWeek = config.currentWeek;
  const phase = getPhaseForWeek(currentWeek);
  const workoutLabels = getWorkoutsForWeek(currentWeek);
  const weights = getAllWeightsForWeek(currentWeek, config);

  const completedIds = new Set(completedWorkoutsData.map(w => w.id));

  return (
    <div className="p-4 pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Week {currentWeek}</h1>
        <PhaseBadge
          phaseNumber={phase.number}
          phaseName={phase.name}
          weekNumber={currentWeek}
        />
      </div>

      {/* Current weights summary */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h2 className="text-sm font-medium text-muted-foreground mb-2">This Week&apos;s Working Weights</h2>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div><span className="text-muted-foreground">SQ:</span> {weights.squat}kg</div>
          <div><span className="text-muted-foreground">BP:</span> {weights.bench}kg</div>
          <div><span className="text-muted-foreground">DL:</span> {weights.deadlift}kg</div>
        </div>
      </div>

      {/* Workouts for this week */}
      <h2 className="text-lg font-semibold mb-3">This Week&apos;s Workouts</h2>
      <div className="space-y-3">
        {workoutLabels.map((label, index) => {
          const template = getTemplate(phase.number, label);
          const isCompleted = completedIds.has(`week-${currentWeek}-day-${label}`);
          const isCurrentDay = !isCompleted && index === workoutLabels.findIndex(
            l => !completedIds.has(`week-${currentWeek}-day-${l}`)
          );

          const activeExerciseCount = template?.exercises.filter(
            ex => isExerciseActiveForWeek(ex, currentWeek)
          ).length || 0;

          return (
            <WorkoutCard
              key={label}
              weekNumber={currentWeek}
              dayLabel={label}
              workoutName={template?.name || ''}
              exerciseCount={activeExerciseCount}
              isCompleted={isCompleted}
              isCurrentDay={isCurrentDay}
            />
          );
        })}
      </div>
    </div>
  );
}
