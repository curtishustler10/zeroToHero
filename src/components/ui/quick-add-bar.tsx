'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  FileText, 
  Brain, 
  MessageSquare, 
  Dumbbell, 
  Moon, 
  DollarSign, 
  UserPlus 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickAddBarProps {
  onAddContent: (data: any) => void
  onAddDeepWork: (data: any) => void
  onAddRep: (data: any) => void
  onAddWorkout: (data: any) => void
  onAddSleep: (data: any) => void
  onAddRevenue: (data: any) => void
  onAddLead: (data: any) => void
  className?: string
}

export function QuickAddBar({
  onAddContent,
  onAddDeepWork,
  onAddRep,
  onAddWorkout,
  onAddSleep,
  onAddRevenue,
  onAddLead,
  className,
}: QuickAddBarProps) {
  const [activeDialog, setActiveDialog] = useState<string | null>(null)

  const quickActions = [
    {
      id: 'content',
      label: 'Content',
      icon: FileText,
      color: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20',
      action: onAddContent,
    },
    {
      id: 'deepwork',
      label: 'Deep Work',
      icon: Brain,
      color: 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20',
      action: onAddDeepWork,
    },
    {
      id: 'rep',
      label: 'Rep',
      icon: MessageSquare,
      color: 'bg-green-500/10 text-green-600 hover:bg-green-500/20',
      action: onAddRep,
    },
    {
      id: 'workout',
      label: 'Workout',
      icon: Dumbbell,
      color: 'bg-red-500/10 text-red-600 hover:bg-red-500/20',
      action: onAddWorkout,
    },
    {
      id: 'sleep',
      label: 'Sleep',
      icon: Moon,
      color: 'bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20',
      action: onAddSleep,
    },
    {
      id: 'revenue',
      label: 'Revenue',
      icon: DollarSign,
      color: 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20',
      action: onAddRevenue,
    },
    {
      id: 'lead',
      label: 'Lead',
      icon: UserPlus,
      color: 'bg-teal-500/10 text-teal-600 hover:bg-teal-500/20',
      action: onAddLead,
    },
  ]

  return (
    <div className={cn("flex flex-wrap gap-2 p-4 bg-card rounded-lg border", className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2 w-full">
        <Plus className="h-4 w-4" />
        Quick Actions
      </div>
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <Dialog key={action.id} open={activeDialog === action.id} onOpenChange={(open) => setActiveDialog(open ? action.id : null)}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center gap-2 text-xs",
                  action.color
                )}
              >
                <action.icon className="h-3 w-3" />
                {action.label}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add {action.label}</DialogTitle>
              </DialogHeader>
              <QuickAddForm
                type={action.id}
                onSubmit={(data) => {
                  action.action(data)
                  setActiveDialog(null)
                }}
                onCancel={() => setActiveDialog(null)}
              />
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}

interface QuickAddFormProps {
  type: string
  onSubmit: (data: any) => void
  onCancel: () => void
}

function QuickAddForm({ type, onSubmit, onCancel }: QuickAddFormProps) {
  const [formData, setFormData] = useState<any>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const renderFormFields = () => {
    switch (type) {
      case 'content':
        return (
          <>
            <Input
              placeholder="Content type (e.g., post, video, article)"
              value={formData.kind || ''}
              onChange={(e) => setFormData({ ...formData, kind: e.target.value })}
              required
            />
            <Input
              placeholder="URL (optional)"
              value={formData.url || ''}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
            <Input
              placeholder="Caption (optional)"
              value={formData.caption || ''}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Minutes spent"
              value={formData.minutes_spent || ''}
              onChange={(e) => setFormData({ ...formData, minutes_spent: parseInt(e.target.value) || 0 })}
            />
          </>
        )
      case 'deepwork':
        return (
          <>
            <Input
              type="number"
              placeholder="Minutes worked"
              value={formData.minutes || ''}
              onChange={(e) => setFormData({ ...formData, minutes: parseInt(e.target.value) || 0 })}
              required
            />
            <Input
              placeholder="Tag (optional)"
              value={formData.tag || ''}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
            />
          </>
        )
      case 'rep':
        return (
          <>
            <Input
              type="number"
              placeholder="Number of conversations"
              value={formData.count || ''}
              onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) || 1 })}
              required
            />
            <Input
              placeholder="Notes (optional)"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </>
        )
      case 'workout':
        return (
          <>
            <Input
              placeholder="Workout type"
              value={formData.type || ''}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Duration (minutes, optional)"
              value={formData.duration_min || ''}
              onChange={(e) => setFormData({ ...formData, duration_min: parseInt(e.target.value) || undefined })}
            />
            <Input
              placeholder="Notes (optional)"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </>
        )
      case 'sleep':
        return (
          <>
            <Input
              type="number"
              step="0.1"
              placeholder="Hours slept"
              value={formData.hours || ''}
              onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) || 0 })}
              required
            />
            <Input
              type="number"
              min="1"
              max="5"
              placeholder="Quality (1-5, optional)"
              value={formData.quality || ''}
              onChange={(e) => setFormData({ ...formData, quality: parseInt(e.target.value) || undefined })}
            />
          </>
        )
      case 'revenue':
        return (
          <>
            <Input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              required
            />
            <Input
              type="number"
              step="0.01"
              placeholder="COGS (optional)"
              value={formData.cogs || ''}
              onChange={(e) => setFormData({ ...formData, cogs: parseFloat(e.target.value) || undefined })}
            />
            <Input
              placeholder="Source (optional)"
              value={formData.source || ''}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            />
            <Input
              placeholder="Notes (optional)"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </>
        )
      case 'lead':
        return (
          <>
            <Input
              placeholder="Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              placeholder="Business (optional)"
              value={formData.business || ''}
              onChange={(e) => setFormData({ ...formData, business: e.target.value })}
            />
            <Input
              placeholder="Niche (optional)"
              value={formData.niche || ''}
              onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
            />
            <Input
              placeholder="Source (optional)"
              value={formData.source || ''}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            />
            <Input
              type="number"
              min="1"
              max="5"
              placeholder="Priority (1-5)"
              value={formData.priority || ''}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 3 })}
            />
          </>
        )
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderFormFields()}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add</Button>
      </div>
    </form>
  )
}