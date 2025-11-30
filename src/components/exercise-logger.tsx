'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Minus, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import type { CompletedSet } from '@/types';

interface Props {
  exerciseName: string;
  plannedSets: number;
  plannedReps: string;
  plannedWeight: number | null;
  initialSets?: CompletedSet[];
  onUpdate: (sets: CompletedSet[]) => void;
}

export function ExerciseLogger({
  exerciseName,
  plannedSets,
  plannedReps,
  plannedWeight,
  initialSets,
  onUpdate
}: Props) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [sets, setSets] = useState<CompletedSet[]>(() =>
    initialSets && initialSets.length > 0
      ? initialSets
      : Array.from({ length: plannedSets }, () => ({
          reps: parseInt(plannedReps) || 0,
          weight: plannedWeight || 0,
          completed: false,
        }))
  );

  const completedCount = sets.filter(s => s.completed).length;

  const updateSet = (index: number, updates: Partial<CompletedSet>) => {
    const newSets = sets.map((set, i) => (i === index ? { ...set, ...updates } : set));
    setSets(newSets);
    onUpdate(newSets);
  };

  const adjustWeight = (index: number, delta: number) => {
    updateSet(index, { weight: Math.max(0, sets[index].weight + delta) });
  };

  const adjustReps = (index: number, delta: number) => {
    updateSet(index, { reps: Math.max(0, sets[index].reps + delta) });
  };

  return (
    <Card className="overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex justify-between items-center text-left"
      >
        <div>
          <h3 className="font-semibold">{exerciseName}</h3>
          <span className="text-sm text-muted-foreground">
            {plannedSets}x{plannedReps} {plannedWeight ? `@ ${plannedWeight}kg` : ''}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${completedCount === plannedSets ? 'text-accent' : ''}`}>
            {completedCount}/{plannedSets}
          </span>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </button>

      {/* Expandable sets */}
      {isExpanded && (
        <div className="px-2 pb-4 space-y-2">
          {sets.map((set, i) => (
            <div
              key={i}
              className={`flex items-center gap-1 p-2 rounded-lg transition-colors ${
                set.completed ? 'bg-accent/20' : 'bg-muted/50'
              }`}
            >
              {/* Weight controls */}
              <div className="flex items-center flex-1 min-w-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => adjustWeight(i, -2.5)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <div className="flex-1 min-w-0 text-center">
                  <Input
                    type="number"
                    step="2.5"
                    value={set.weight}
                    onChange={(e) => updateSet(i, { weight: parseFloat(e.target.value) || 0 })}
                    className="h-8 text-center font-medium text-sm px-1"
                  />
                  <span className="text-xs text-muted-foreground">kg</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => adjustWeight(i, 2.5)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <span className="text-muted-foreground text-sm">×</span>

              {/* Reps controls */}
              <div className="flex items-center w-24 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => adjustReps(i, -1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <div className="flex-1 text-center">
                  <Input
                    type="number"
                    value={set.reps}
                    onChange={(e) => updateSet(i, { reps: parseInt(e.target.value) || 0 })}
                    className="h-8 text-center font-medium text-sm px-1"
                  />
                  <span className="text-xs text-muted-foreground">reps</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => adjustReps(i, 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Complete button */}
              <Button
                variant={set.completed ? 'default' : 'outline'}
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={() => updateSet(i, { completed: !set.completed })}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
