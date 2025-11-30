'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ExerciseLogger } from '@/components/exercise-logger';
import { PhaseBadge } from '@/components/phase-badge';
import { ArrowLeft, Save, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { getConfig, getCompletedWorkout, saveWorkout, deleteWorkout } from '@/app/actions';
import { getPhaseForWeek, getTemplate } from '@/lib/program-data';
import { getSetsRepsForWeek, parseSetsReps, getExerciseWeight } from '@/lib/weight-calculator';
import type { Config, CompletedSet, ExerciseLog, TemplateExercise } from '@/types';

interface PageProps {
  params: Promise<{
    weekNumber: string;
    dayLabel: string;
  }>;
}

export default function WorkoutLoggerPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const weekNumber = parseInt(resolvedParams.weekNumber);
  const dayLabel = resolvedParams.dayLabel;

  const [config, setConfig] = useState<Config | null>(null);
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, CompletedSet[]>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const phase = getPhaseForWeek(weekNumber);
  const template = getTemplate(phase.number, dayLabel);

  // Load config and existing workout data on mount
  useEffect(() => {
    async function loadData() {
      const [configData, existingWorkout] = await Promise.all([
        getConfig(),
        getCompletedWorkout(weekNumber, dayLabel)
      ]);

      const configTyped: Config = {
        id: configData.id ?? 'default',
        programStartDate: configData.programStartDate,
        startingSquat: configData.startingSquat,
        startingBench: configData.startingBench,
        startingDeadlift: configData.startingDeadlift,
        startingRdl: configData.startingRdl,
        startingOhp: configData.startingOhp,
        weeklyIncrement: configData.weeklyIncrement,
        deloadPercentage: configData.deloadPercentage,
        currentWeek: configData.currentWeek,
        squatAdjustment: configData.squatAdjustment ?? 0,
        benchAdjustment: configData.benchAdjustment ?? 0,
        deadliftAdjustment: configData.deadliftAdjustment ?? 0,
        rdlAdjustment: configData.rdlAdjustment ?? 0,
        ohpAdjustment: configData.ohpAdjustment ?? 0,
      };
      setConfig(configTyped);

      // If there's existing workout data, load it
      if (existingWorkout) {
        const logs = JSON.parse(existingWorkout.exerciseLogsJson) as ExerciseLog[];
        const logsMap: Record<string, CompletedSet[]> = {};
        logs.forEach(log => {
          logsMap[log.exerciseId] = log.sets;
        });
        setExerciseLogs(logsMap);
        setHasSavedData(true);
      }

      setIsLoading(false);
    }
    loadData();
  }, [weekNumber, dayLabel]);

  const handleExerciseUpdate = (exerciseId: string, sets: CompletedSet[]) => {
    setExerciseLogs(prev => ({
      ...prev,
      [exerciseId]: sets
    }));
  };

  const handleSave = async () => {
    if (!template) return;

    setIsSaving(true);

    const logs: ExerciseLog[] = template.exercises.map(exercise => ({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: exerciseLogs[exercise.id] || []
    }));

    await saveWorkout({
      weekNumber,
      phaseNumber: phase.number,
      dayLabel,
      templateId: template.id,
      exerciseLogs: logs,
    });

    setIsSaving(false);
    setHasSavedData(true);
    router.push('/');
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset this workout? All saved data will be deleted.')) {
      return;
    }

    setIsResetting(true);
    await deleteWorkout(weekNumber, dayLabel);
    setExerciseLogs({});
    setHasSavedData(false);
    setIsResetting(false);
  };

  if (isLoading || !config || !template) {
    return (
      <div className="p-4 pb-24 max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Week {weekNumber} - Day {dayLabel}</h1>
          <p className="text-sm text-muted-foreground">{template.name}</p>
          <PhaseBadge
            phaseNumber={phase.number}
            phaseName={phase.name}
            weekNumber={weekNumber}
          />
        </div>
        {hasSavedData && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            disabled={isResetting}
            title="Reset workout"
          >
            <RotateCcw className={`h-5 w-5 ${isResetting ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>

      {/* Exercise list */}
      <div className="space-y-4">
        {template.exercises.map((exercise: TemplateExercise) => {
          const setsReps = getSetsRepsForWeek(exercise, weekNumber);
          const { sets, reps } = parseSetsReps(setsReps);
          const weight = getExerciseWeight(exercise, weekNumber, config);

          return (
            <ExerciseLogger
              key={exercise.id}
              exerciseName={exercise.name}
              plannedSets={sets}
              plannedReps={reps}
              plannedWeight={weight}
              initialSets={exerciseLogs[exercise.id]}
              onUpdate={(newSets) => handleExerciseUpdate(exercise.id, newSets)}
            />
          );
        })}
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
