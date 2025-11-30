'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { getConfig, setCurrentWeek } from '../actions';
import { formatDate } from '@/lib/week-calculator';

export default function SettingsPage() {
  const [configState, setConfigState] = useState({
    currentWeek: 1,
    programStartDate: null as string | null,
  });
  const [newWeek, setNewWeek] = useState(1);
  const [isSettingWeek, setIsSettingWeek] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load config on mount
  useEffect(() => {
    getConfig().then(data => {
      setConfigState({
        currentWeek: data.currentWeek,
        programStartDate: data.programStartDate,
      });
      setNewWeek(data.currentWeek);
      setIsLoading(false);
    });
  }, []);

  const handleSetWeek = async () => {
    setIsSettingWeek(true);
    await setCurrentWeek(newWeek);
    // Reload config to get updated values
    const data = await getConfig();
    setConfigState(prev => ({
      ...prev,
      currentWeek: data.currentWeek,
      programStartDate: data.programStartDate,
    }));
    setIsSettingWeek(false);
  };

  // Calculate next Sunday
  const getNextSunday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + daysUntilSunday);
    return nextSunday.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
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
        <h2 className="font-semibold mb-3">Program Progress</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Current Week</span>
            <span className="text-xl font-bold">{configState.currentWeek} of 26</span>
          </div>
          {configState.programStartDate && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Program Started</span>
              <span>{formatDate(configState.programStartDate)}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Next week starts</span>
            <span>{getNextSunday()}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Weeks automatically advance every Sunday.
          </p>
        </div>

        <hr className="my-4" />

        <div className="space-y-3">
          <Label htmlFor="setWeek">Set Current Week</Label>
          <div className="flex gap-2">
            <Input
              id="setWeek"
              type="number"
              min={1}
              max={26}
              value={newWeek}
              onChange={(e) => setNewWeek(parseInt(e.target.value) || 1)}
              className="flex-1"
            />
            <Button
              onClick={handleSetWeek}
              disabled={isSettingWeek || newWeek === configState.currentWeek}
              variant="outline"
            >
              {isSettingWeek ? 'Setting...' : 'Set'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This will adjust the program start date so the current week matches your selection.
          </p>
        </div>
      </Card>
    </div>
  );
}
