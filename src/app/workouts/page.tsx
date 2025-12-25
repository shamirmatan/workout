import { getConfig, getCompletedWorkouts } from '../actions';
import { getWorkoutsForWeek, getTemplate } from '@/lib/program-data';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function WorkoutsPage() {
  const config = await getConfig();
  const completedWorkoutsData = await getCompletedWorkouts();
  const completedIds = new Set(completedWorkoutsData.map(w => w.id));

  // Show weeks 1 to currentWeek + 4 (enough to plan ahead)
  const maxWeek = config.currentWeek + 4;
  const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1);

  return (
    <div className="p-4 pb-20 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Workouts</h1>

      {/* Current week indicator */}
      <Card className="p-4 mb-6 bg-primary/10">
        <p className="text-sm font-medium">
          Currently on Week {config.currentWeek}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          3 days per week • Linear progression
        </p>
      </Card>

      {/* Weeks list */}
      <div className="space-y-4">
        {weeks.map(week => {
          const workoutLabels = getWorkoutsForWeek(week);
          const completedCount = workoutLabels.filter(
            label => completedIds.has(`week-${week}-day-${label}`)
          ).length;
          const isCurrentWeek = week === config.currentWeek;
          const isPastWeek = week < config.currentWeek;

          return (
            <Card
              key={week}
              className={`p-4 ${isCurrentWeek ? 'ring-2 ring-primary' : ''} ${isPastWeek ? 'opacity-70' : ''}`}
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
                  const template = getTemplate(1, label);
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
  );
}
