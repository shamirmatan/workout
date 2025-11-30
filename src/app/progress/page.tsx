'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { getConfig, getCompletedWorkouts } from '../actions';
import { getAllWeightsForWeek } from '@/lib/weight-calculator';
import { PHASES } from '@/lib/program-data';
import type { Config, MainLift } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const LIFT_COLORS: Record<MainLift, string> = {
  squat: '#3b82f6',
  bench: '#ef4444',
  deadlift: '#22c55e',
  rdl: '#f59e0b',
  ohp: '#8b5cf6',
};

const LIFT_LABELS: Record<MainLift, string> = {
  squat: 'Squat',
  bench: 'Bench',
  deadlift: 'Deadlift',
  rdl: 'RDL',
  ohp: 'OHP',
};

export default function ProgressPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [configData, completedWorkouts] = await Promise.all([
        getConfig(),
        getCompletedWorkouts()
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
      };

      setConfig(configTyped);
      setCompletedCount(completedWorkouts.length);
      setIsLoading(false);
    }
    loadData();
  }, []);

  if (isLoading || !config) {
    return (
      <div className="p-4 pb-20 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Progress</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Generate weight data for all 26 weeks
  const chartData = Array.from({ length: 26 }, (_, i) => {
    const week = i + 1;
    const weights = getAllWeightsForWeek(week, config);
    return {
      week,
      ...weights,
    };
  });

  // Calculate total workouts
  const totalWorkouts = PHASES.reduce((sum, phase) => {
    const weeksInPhase = phase.endWeek - phase.startWeek + 1;
    return sum + (weeksInPhase * phase.daysPerWeek);
  }, 0);

  const progressPercentage = Math.round((completedCount / totalWorkouts) * 100);

  return (
    <div className="p-4 pb-20 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Progress</h1>

      {/* Progress overview */}
      <Card className="p-4 mb-6">
        <h2 className="font-semibold mb-3">Program Progress</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Workouts Completed</span>
            <span className="font-medium">{completedCount} / {totalWorkouts}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">
            {progressPercentage}% complete
          </p>
        </div>
      </Card>

      {/* Current week stats */}
      <Card className="p-4 mb-6">
        <h2 className="font-semibold mb-3">Week {config.currentWeek} Working Weights</h2>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(LIFT_LABELS) as MainLift[]).map(lift => {
            const weight = getAllWeightsForWeek(config.currentWeek, config)[lift];
            return (
              <div key={lift} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: LIFT_COLORS[lift] }}
                />
                <span className="text-sm">
                  {LIFT_LABELS[lift]}: <span className="font-medium">{weight}kg</span>
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Weight progression chart */}
      <Card className="p-4">
        <h2 className="font-semibold mb-4">Weight Progression</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              {(Object.keys(LIFT_COLORS) as MainLift[]).map(lift => (
                <Line
                  key={lift}
                  type="monotone"
                  dataKey={lift}
                  name={LIFT_LABELS[lift]}
                  stroke={LIFT_COLORS[lift]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Projected weights for all 26 weeks
        </p>
      </Card>
    </div>
  );
}
