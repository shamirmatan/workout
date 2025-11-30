import { DELOAD_WEEKS } from '@/lib/program-data';

interface Props {
  phaseNumber: number;
  phaseName: string;
  weekNumber: number;
}

export function PhaseBadge({ phaseNumber, phaseName, weekNumber }: Props) {
  const isDeload = DELOAD_WEEKS.includes(weekNumber as typeof DELOAD_WEEKS[number]);

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
