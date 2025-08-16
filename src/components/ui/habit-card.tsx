'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProgressRing } from './progress-ring'
import { Plus, Minus, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Habit, HabitLog } from '@/lib/schemas'

interface HabitCardProps {
  habit: Habit
  todayLog?: HabitLog
  onUpdateLog: (habitId: number, value: number) => void
  className?: string
}

export function HabitCard({ habit, todayLog, onUpdateLog, className }: HabitCardProps) {
  const [inputValue, setInputValue] = useState(todayLog?.value?.toString() || '0')
  const currentValue = todayLog?.value || 0
  const progress = Math.min(100, (currentValue / habit.target) * 100)
  const isComplete = currentValue >= habit.target

  const handleQuickAdd = (amount: number) => {
    const newValue = Math.max(0, currentValue + amount)
    onUpdateLog(habit.id, newValue)
    setInputValue(newValue.toString())
  }

  const handleInputSubmit = () => {
    const value = parseInt(inputValue) || 0
    onUpdateLog(habit.id, Math.max(0, value))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputSubmit()
    }
  }

  return (
    <Card className={cn("transition-all duration-200", isComplete && "ring-2 ring-green-500/20 bg-green-50/50", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span>{habit.name}</span>
          {isComplete && <Check className="h-4 w-4 text-green-600" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <ProgressRing progress={progress} size={80} strokeWidth={6}>
            <div className="text-center">
              <div className="text-lg font-bold">{currentValue}</div>
              <div className="text-xs text-muted-foreground">/{habit.target}</div>
            </div>
          </ProgressRing>
        </div>
        
        <div className="text-xs text-center text-muted-foreground">
          {habit.unit}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAdd(-1)}
            disabled={currentValue <= 0}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <Input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputSubmit}
            onKeyPress={handleKeyPress}
            className="text-center text-sm h-8"
            min="0"
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAdd(1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {habit.unit === 'minutes' && (
          <div className="flex gap-1">
            {[15, 30, 60].map((minutes) => (
              <Button
                key={minutes}
                variant="ghost"
                size="sm"
                onClick={() => handleQuickAdd(minutes)}
                className="flex-1 text-xs"
              >
                +{minutes}m
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}