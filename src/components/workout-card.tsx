import Link from 'next/link';
import { Card } from '@/components/ui/card';
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
        isCurrentDay ? 'border-2 border-primary' : ''
      } ${isCompleted ? 'bg-accent/10' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isCompleted ? (
              <CheckCircle2 className="h-6 w-6 text-accent" />
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
