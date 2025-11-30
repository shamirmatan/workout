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
        <div className="px-4 pb-4 space-y-3">
          {sets.map((set, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                set.completed ? 'bg-accent/20' : 'bg-muted/50'
              }`}
            >
              <span className="w-8 text-sm text-muted-foreground font-medium">#{i + 1}</span>

              {/* Weight controls */}
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => adjustWeight(i, -2.5)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-20 text-center">
                  <Input
                    type="number"
                    step="2.5"
                    value={set.weight}
                    onChange={(e) => updateSet(i, { weight: parseFloat(e.target.value) || 0 })}
                    className="h-10 text-center font-medium"
                  />
                  <span className="text-xs text-muted-foreground">kg</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => adjustWeight(i, 2.5)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <span className="text-muted-foreground">×</span>

              {/* Reps controls */}
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => adjustReps(i, -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-14 text-center">
                  <Input
                    type="number"
                    value={set.reps}
                    onChange={(e) => updateSet(i, { reps: parseInt(e.target.value) || 0 })}
                    className="h-10 text-center font-medium"
                  />
                  <span className="text-xs text-muted-foreground">reps</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => adjustReps(i, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Complete button */}
              <Button
                variant={set.completed ? 'default' : 'outline'}
                size="icon"
                className="h-10 w-10 ml-auto"
                onClick={() => updateSet(i, { completed: !set.completed })}
              >
                <Check className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
