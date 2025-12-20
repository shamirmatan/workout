import { getConfig, getCompletedWorkouts } from '../actions';
import { PHASES, getWorkoutsForWeek, getTemplate } from '@/lib/program-data';
import { PhaseBadge } from '@/components/phase-badge';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function WorkoutsPage() {
  const config = await getConfig();
  const completedWorkoutsData = await getCompletedWorkouts();
  const completedIds = new Set(completedWorkoutsData.map(w => w.id));

  // Group weeks by phase
  const weeksByPhase = PHASES.map(phase => {
    const weeks = [];
    for (let week = phase.startWeek; week <= phase.endWeek; week++) {
      weeks.push(week);
    }
    return { phase, weeks };
  });

  return (
    <div className="p-4 pb-20 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Workouts</h1>

      {/* Current week indicator */}
      <Card className="p-4 mb-6 bg-primary/10">
        <p className="text-sm font-medium">
          Currently on Week {config.currentWeek} of 16
        </p>
      </Card>

      {/* Weeks grouped by phase */}
      {weeksByPhase.map(({ phase, weeks }) => (
        <div key={phase.number} className="mb-8">
          <div className="mb-4">
            <PhaseBadge
              phaseNumber={phase.number}
              phaseName={phase.name}
              weekNumber={phase.startWeek}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Weeks {phase.startWeek}-{phase.endWeek} • {phase.daysPerWeek} days/week
            </p>
          </div>

          <div className="space-y-4">
            {weeks.map(week => {
              const workoutLabels = getWorkoutsForWeek(week);
              const completedCount = workoutLabels.filter(
                label => completedIds.has(`week-${week}-day-${label}`)
              ).length;
              const isCurrentWeek = week === config.currentWeek;

              return (
                <Card
                  key={week}
                  className={`p-4 ${isCurrentWeek ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">
                      Week {week}
                      {isCurrentWeek && (
                        <span className="ml-2 text-xs text-primary">(Current)</span>
                      )}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {completedCount}/{workoutLabels.length} completed
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {workoutLabels.map(label => {
                      const template = getTemplate(phase.number, label);
                      const isCompleted = completedIds.has(`week-${week}-day-${label}`);

                      return (
                        <Link
                          key={label}
                          href={`/workouts/${week}/${label}`}
                          className={`p-2 rounded-lg text-center text-sm transition-colors ${
                            isCompleted
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          <div className="font-medium">Day {label}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {template?.name}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
