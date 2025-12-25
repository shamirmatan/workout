'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { getConfig, getCompletedWorkouts, getPersonalRecords } from '../actions';
import { getAllWeightsForWeek } from '@/lib/weight-calculator';
import type { Config, MainLift } from '@/types';
import { Trophy } from 'lucide-react';
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

// Only show main lifts on the chart (not accessories)
const CHART_LIFTS: MainLift[] = ['squat', 'bench', 'deadlift', 'ohp'];

const LIFT_COLORS: Record<MainLift, string> = {
  squat: '#a855f7',       // neon purple
  bench: '#f472b6',       // neon pink
  deadlift: '#22d3ee',    // neon cyan
  ohp: '#4ade80',         // neon green
  row: '#fbbf24',         // yellow
  lunges: '#f97316',      // orange
  goodmornings: '#ec4899',// magenta
  rdl: '#06b6d4',         // teal
};

const LIFT_LABELS: Record<MainLift, string> = {
  squat: 'Squat',
  bench: 'Bench',
  deadlift: 'Deadlift',
  ohp: 'OHP',
  row: 'Row',
  lunges: 'Lunges',
  goodmornings: 'Good Mornings',
  rdl: 'Romanian DL',
};

export default function ProgressPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [personalRecords, setPersonalRecords] = useState<Record<string, { weight: number; exerciseName: string }>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [configData, completedWorkouts, records] = await Promise.all([
        getConfig(),
        getCompletedWorkouts(),
        getPersonalRecords()
      ]);

      const configTyped: Config = {
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

      setConfig(configTyped);
      setCompletedCount(completedWorkouts.length);
      setPersonalRecords(records);
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

  // Generate weight data for 12 weeks from current week
  const startWeek = Math.max(1, config.currentWeek - 2);
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const week = startWeek + i;
    const weights = getAllWeightsForWeek(week, config);
    return {
      week,
      squat: weights.squat,
      bench: weights.bench,
      deadlift: weights.deadlift,
      ohp: weights.ohp,
    };
  });

  // Total workouts: 3 per week, open-ended
  const weeksCompleted = Math.floor(completedCount / 3);

  return (
    <div className="p-4 pb-20 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Progress</h1>

      {/* Progress overview */}
      <Card className="p-4 mb-6">
        <h2 className="font-semibold mb-3">Program Progress</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Workouts Completed</span>
            <span className="font-medium">{completedCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Weeks Completed</span>
            <span className="font-medium">{weeksCompleted}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Current Week</span>
            <span className="font-medium">{config.currentWeek}</span>
          </div>
        </div>
      </Card>

      {/* Personal Records */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-5 w-5 text-accent" />
          <h2 className="font-semibold">Personal Records</h2>
        </div>
        {Object.keys(personalRecords).length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Complete workouts to see your personal records here.
          </p>
        ) : (
          <div className="space-y-2">
            {Object.values(personalRecords)
              .sort((a, b) => b.weight - a.weight)
              .map(record => (
                <div key={record.exerciseName} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{record.exerciseName}</span>
                  <span className="font-medium">{record.weight}kg</span>
                </div>
              ))}
          </div>
        )}
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
              {CHART_LIFTS.map(lift => (
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
          Main lift weights (weeks {startWeek}-{startWeek + 11})
        </p>
      </Card>
    </div>
  );
}
