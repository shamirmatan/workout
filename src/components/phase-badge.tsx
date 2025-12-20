import { DELOAD_WEEKS } from '@/lib/program-data';

interface Props {
  phaseNumber: number;
  phaseName: string;
  weekNumber: number;
}

export function PhaseBadge({ phaseNumber, phaseName, weekNumber }: Props) {
  const isDeload = DELOAD_WEEKS.includes(weekNumber as number);

  const phaseColors: Record<number, string> = {
    1: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    2: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    3: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    4: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    5: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`
        px-2 py-1 rounded-full text-xs font-medium
        ${phaseColors[phaseNumber] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}
      `}>
        {phaseName}
      </span>
      {isDeload && (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          Deload
        </span>
      )}
    </div>
  );
}
