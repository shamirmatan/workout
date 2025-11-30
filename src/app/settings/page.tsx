'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { getConfig, updateConfig } from '../actions';

export default function SettingsPage() {
  const [configState, setConfigState] = useState({
    currentWeek: 1,
    startingSquat: 52.5,
    startingBench: 37.5,
    startingDeadlift: 55,
    startingRdl: 42.5,
    startingOhp: 27.5,
    weeklyIncrement: 2.5,
    deloadPercentage: 0.6,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load config on mount
  useEffect(() => {
    getConfig().then(data => {
      setConfigState({
        currentWeek: data.currentWeek,
        startingSquat: data.startingSquat,
        startingBench: data.startingBench,
        startingDeadlift: data.startingDeadlift,
        startingRdl: data.startingRdl,
        startingOhp: data.startingOhp,
        weeklyIncrement: data.weeklyIncrement,
        deloadPercentage: data.deloadPercentage,
      });
      setIsLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await updateConfig(configState);
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="p-4 pb-20 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Current Week */}
      <Card className="p-4 mb-4">
        <Label htmlFor="currentWeek">Current Week</Label>
        <Input
          id="currentWeek"
          type="number"
          min={1}
          max={26}
          value={configState.currentWeek}
          onChange={(e) => setConfigState({ ...configState, currentWeek: parseInt(e.target.value) || 1 })}
          className="mt-2"
        />
      </Card>

      {/* Starting Weights */}
      <Card className="p-4 mb-4">
        <h2 className="font-semibold mb-4">Starting Weights (kg)</h2>
        <div className="space-y-4">
          {[
            { key: 'startingSquat', label: 'Squat' },
            { key: 'startingBench', label: 'Bench Press' },
            { key: 'startingDeadlift', label: 'Deadlift' },
            { key: 'startingRdl', label: 'Romanian Deadlift' },
            { key: 'startingOhp', label: 'Overhead Press' },
          ].map(({ key, label }) => (
            <div key={key}>
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type="number"
                step={2.5}
                value={configState[key as keyof typeof configState]}
                onChange={(e) => setConfigState({ ...configState, [key]: parseFloat(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Progression Settings */}
      <Card className="p-4 mb-6">
        <h2 className="font-semibold mb-4">Progression</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="weeklyIncrement">Weekly Increment (kg)</Label>
            <Input
              id="weeklyIncrement"
              type="number"
              step={0.5}
              value={configState.weeklyIncrement}
              onChange={(e) => setConfigState({ ...configState, weeklyIncrement: parseFloat(e.target.value) || 2.5 })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="deloadPercentage">Deload Percentage</Label>
            <Input
              id="deloadPercentage"
              type="number"
              step={0.05}
              min={0}
              max={1}
              value={configState.deloadPercentage}
              onChange={(e) => setConfigState({ ...configState, deloadPercentage: parseFloat(e.target.value) || 0.6 })}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {Math.round(configState.deloadPercentage * 100)}% of working weight
            </p>
          </div>
        </div>
      </Card>

      <Button onClick={handleSave} disabled={isSaving} className="w-full">
        {isSaving ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  );
}
