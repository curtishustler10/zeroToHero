'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/components/auth/auth-provider'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { format, subDays, addDays } from 'date-fns'
import { 
  Plus, 
  Calendar, 
  Clock, 
  Target, 
  Zap,
  Heart,
  Brain,
  Users,
  ChevronLeft,
  ChevronRight,
  Smile,
  Meh,
  Frown
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface DayData {
  date: string
  mood?: number
  notes?: string
  content: any[]
  deepWork: any[]
  socialReps: any[]
  workouts: any[]
  sleep?: any
  habits: any[]
}

export default function LogPage() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [dayData, setDayData] = useState<DayData>({
    date: selectedDate,
    content: [],
    deepWork: [],
    socialReps: [],
    workouts: [],
    habits: []
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadDayData()
    }
  }, [user, selectedDate])

  const loadDayData = async () => {
    try {
      const [
        dayRes,
        contentRes,
        deepWorkRes,
        socialRes,
        workoutsRes,
        sleepRes,
        habitsRes
      ] = await Promise.all([
        supabase
          .from('days')
          .select('*')
          .eq('user_id', user?.id)
          .eq('date', selectedDate)
          .single(),
        supabase
          .from('content_logs')
          .select('*')
          .eq('user_id', user?.id)
          .eq('date', selectedDate)
          .order('created_at', { ascending: false }),
        supabase
          .from('deepwork_logs')
          .select('*')
          .eq('user_id', user?.id)
          .gte('start_time', `${selectedDate}T00:00:00`)
          .lt('start_time', `${selectedDate}T23:59:59`)
          .order('start_time', { ascending: false }),
        supabase
          .from('social_reps')
          .select('*')
          .eq('user_id', user?.id)
          .eq('date', selectedDate),
        supabase
          .from('workouts')
          .select('*')
          .eq('user_id', user?.id)
          .eq('date', selectedDate)
          .order('created_at', { ascending: false }),
        supabase
          .from('sleep_logs')
          .select('*')
          .eq('user_id', user?.id)
          .eq('date', selectedDate)
          .single(),
        supabase
          .from('habit_logs')
          .select(`
            *,
            habit:habits(*)
          `)
          .eq('user_id', user?.id)
          .eq('date', selectedDate)
      ])

      setDayData({
        date: selectedDate,
        mood: dayRes.data?.mood,
        notes: dayRes.data?.notes,
        content: contentRes.data || [],
        deepWork: deepWorkRes.data || [],
        socialReps: socialRes.data || [],
        workouts: workoutsRes.data || [],
        sleep: sleepRes.data,
        habits: habitsRes.data || []
      })
    } catch (error) {
      console.error('Error loading day data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateDayMood = async (mood: number) => {
    try {
      const { error } = await supabase
        .from('days')
        .upsert({
          user_id: user?.id,
          date: selectedDate,
          mood,
          notes: dayData.notes
        })

      if (error) throw error
      
      setDayData(prev => ({ ...prev, mood }))
      toast.success('Mood updated!')
    } catch (error) {
      console.error('Error updating mood:', error)
      toast.error('Failed to update mood')
    }
  }

  const updateDayNotes = async (notes: string) => {
    try {
      const { error } = await supabase
        .from('days')
        .upsert({
          user_id: user?.id,
          date: selectedDate,
          mood: dayData.mood,
          notes
        })

      if (error) throw error
      
      setDayData(prev => ({ ...prev, notes }))
      toast.success('Notes updated!')
    } catch (error) {
      console.error('Error updating notes:', error)
      toast.error('Failed to update notes')
    }
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate)
    const newDate = direction === 'prev' 
      ? subDays(currentDate, 1)
      : addDays(currentDate, 1)
    setSelectedDate(format(newDate, 'yyyy-MM-dd'))
  }

  const getMoodIcon = (mood: number) => {
    if (mood >= 4) return <Smile className="h-5 w-5 text-green-500" />
    if (mood === 3) return <Meh className="h-5 w-5 text-yellow-500" />
    return <Frown className="h-5 w-5 text-red-500" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daily Log</h1>
          <p className="text-muted-foreground">Detailed view of your daily activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigateDate('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="px-4 py-2 bg-muted rounded-md text-sm font-medium min-w-48 text-center">
            {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigateDate('next')}
            disabled={selectedDate >= format(new Date(), 'yyyy-MM-dd')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content ({dayData.content.length})</TabsTrigger>
          <TabsTrigger value="deepwork">Deep Work ({dayData.deepWork.length})</TabsTrigger>
          <TabsTrigger value="social">Social ({dayData.socialReps.length})</TabsTrigger>
          <TabsTrigger value="fitness">Fitness ({dayData.workouts.length})</TabsTrigger>
          <TabsTrigger value="habits">Habits ({dayData.habits.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Daily Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-2 mb-4">
                  {dayData.mood && getMoodIcon(dayData.mood)}
                  <span className="text-lg font-medium">
                    {dayData.mood ? `${dayData.mood}/5` : 'Not set'}
                  </span>
                </div>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((mood) => (
                    <Button
                      key={mood}
                      variant={dayData.mood === mood ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateDayMood(mood)}
                    >
                      {mood}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Daily Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="How was your day? Any insights or reflections..."
                  value={dayData.notes || ''}
                  onChange={(e) => setDayData(prev => ({ ...prev, notes: e.target.value }))}
                  onBlur={(e) => updateDayNotes(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{dayData.content.length}</div>
                <div className="text-xs text-muted-foreground">Content Created</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {dayData.deepWork.reduce((sum, log) => sum + (log.minutes || 0), 0)}m
                </div>
                <div className="text-xs text-muted-foreground">Deep Work</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {dayData.socialReps.reduce((sum, rep) => sum + (rep.count || 0), 0)}
                </div>
                <div className="text-xs text-muted-foreground">Social Reps</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{dayData.workouts.length}</div>
                <div className="text-xs text-muted-foreground">Workouts</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="space-y-4">
            {dayData.content.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No content logged for this day
                </CardContent>
              </Card>
            ) : (
              dayData.content.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{item.title || 'Untitled Content'}</h3>
                      <span className="text-xs text-muted-foreground">
                        {item.platform && `${item.platform} • `}
                        {format(new Date(item.created_at), 'HH:mm')}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    )}
                    {item.url && (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        View Content →
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="deepwork" className="space-y-4">
          <div className="space-y-4">
            {dayData.deepWork.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No deep work sessions logged for this day
                </CardContent>
              </Card>
            ) : (
              dayData.deepWork.map((session, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{session.task || 'Deep Work Session'}</h3>
                      <div className="text-right">
                        <div className="text-sm font-medium">{session.minutes || 0} minutes</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(session.start_time), 'HH:mm')}
                        </div>
                      </div>
                    </div>
                    {session.notes && (
                      <p className="text-sm text-muted-foreground">{session.notes}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="space-y-4">
            {dayData.socialReps.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No social reps logged for this day
                </CardContent>
              </Card>
            ) : (
              dayData.socialReps.map((rep, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">Social Reps</h3>
                      <div className="text-sm font-medium">{rep.count || 0} interactions</div>
                    </div>
                    {rep.notes && (
                      <p className="text-sm text-muted-foreground">{rep.notes}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="fitness" className="space-y-4">
          <div className="space-y-4">
            {dayData.workouts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No workouts logged for this day
                </CardContent>
              </Card>
            ) : (
              dayData.workouts.map((workout, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{workout.exercise || 'Workout'}</h3>
                      <div className="text-right">
                        {workout.duration && (
                          <div className="text-sm font-medium">{workout.duration} min</div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(workout.created_at), 'HH:mm')}
                        </div>
                      </div>
                    </div>
                    {workout.notes && (
                      <p className="text-sm text-muted-foreground">{workout.notes}</p>
                    )}
                    {workout.sets && workout.reps && (
                      <div className="text-sm text-muted-foreground">
                        {workout.sets} sets × {workout.reps} reps
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
            {dayData.sleep && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sleep</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm">
                    {dayData.sleep.bedtime && (
                      <div>Bedtime: {format(new Date(dayData.sleep.bedtime), 'HH:mm')}</div>
                    )}
                    {dayData.sleep.wake_time && (
                      <div>Wake time: {format(new Date(dayData.sleep.wake_time), 'HH:mm')}</div>
                    )}
                    {dayData.sleep.hours && (
                      <div>Total: {dayData.sleep.hours} hours</div>
                    )}
                    {dayData.sleep.quality && (
                      <div>Quality: {dayData.sleep.quality}/10</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="habits" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dayData.habits.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="p-8 text-center text-muted-foreground">
                  No habits logged for this day
                </CardContent>
              </Card>
            ) : (
              dayData.habits.map((habitLog, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{habitLog.habit?.name || 'Habit'}</h3>
                      <div className="text-sm font-medium">
                        {habitLog.value}/{habitLog.habit?.target_value || 1}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (habitLog.value / (habitLog.habit?.target_value || 1)) * 100)}%` 
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}