'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressRing } from '@/components/ui/progress-ring'
import { StreakBadge } from '@/components/ui/streak-badge'
import { QuickAddBar } from '@/components/ui/quick-add-bar'
import { HabitCard } from '@/components/ui/habit-card'
import { useAuth } from '@/components/auth/auth-provider'
import { createClient } from '@/lib/supabase'
import { format } from 'date-fns'
import { 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Zap,
  Star
} from 'lucide-react'
import { toast } from 'sonner'

interface DashboardData {
  habits: any[]
  habitLogs: any[]
  todayScore: number
  streak: number
  todayStats: {
    content: number
    deepWork: number
    socialReps: number
    workouts: number
    sleep: boolean
  }
  motivationalPrompt: string
}

export function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData>({
    habits: [],
    habitLogs: [],
    todayScore: 0,
    streak: 0,
    todayStats: {
      content: 0,
      deepWork: 0,
      socialReps: 0,
      workouts: 0,
      sleep: false,
    },
    motivationalPrompt: "Every small step forward is progress. Keep building.",
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      // Load habits and today's logs
      const [habitsRes, logsRes, promptRes] = await Promise.all([
        supabase
          .from('habits')
          .select('*')
          .eq('user_id', user?.id)
          .eq('is_active', true)
          .order('sort_order'),
        supabase
          .from('habit_logs')
          .select('*')
          .eq('user_id', user?.id)
          .eq('date', today),
        supabase
          .from('prompts')
          .select('*')
          .eq('kind', 'motivational')
          .is('user_id', null)
          .order('weight', { ascending: false })
          .limit(1)
      ])

      if (habitsRes.error) throw habitsRes.error
      if (logsRes.error) throw logsRes.error

      // Calculate today's stats
      const todayStats = await calculateTodayStats()
      const todayScore = calculateDailyScore(todayStats)
      const streak = await calculateStreak()

      setData({
        habits: habitsRes.data || [],
        habitLogs: logsRes.data || [],
        todayScore,
        streak,
        todayStats,
        motivationalPrompt: promptRes.data?.[0]?.text || "Every small step forward is progress. Keep building.",
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const calculateTodayStats = async () => {
    const [contentRes, deepWorkRes, socialRes, workoutsRes, sleepRes] = await Promise.all([
      supabase
        .from('content_logs')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today),
      supabase
        .from('deepwork_logs')
        .select('minutes')
        .eq('user_id', user?.id)
        .gte('start_time', `${today}T00:00:00`)
        .lt('start_time', `${today}T23:59:59`),
      supabase
        .from('social_reps')
        .select('count')
        .eq('user_id', user?.id)
        .eq('date', today)
        .single(),
      supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today),
      supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today)
        .single()
    ])

    return {
      content: contentRes.data?.length || 0,
      deepWork: deepWorkRes.data?.reduce((sum, log) => sum + log.minutes, 0) || 0,
      socialReps: socialRes.data?.count || 0,
      workouts: workoutsRes.data?.length || 0,
      sleep: !!sleepRes.data,
    }
  }

  const calculateDailyScore = (stats: any) => {
    let score = 0
    
    // Content (30 points)
    if (stats.content > 0) score += 30
    
    // Deep work (30 points, proportional to 120 min target)
    score += Math.min(30, (stats.deepWork / 120) * 30)
    
    // Social reps (20 points, proportional to 10 target)
    score += Math.min(20, (stats.socialReps / 10) * 20)
    
    // Workout + sleep (20 points, 10 each)
    if (stats.workouts > 0) score += 10
    if (stats.sleep) score += 10

    return Math.round(score)
  }

  const calculateStreak = async () => {
    // This is a simplified streak calculation
    // In a real app, you'd want to query the v_daily_score view
    // and count consecutive days with score >= 70
    return 3 // Placeholder
  }

  const handleUpdateHabitLog = async (habitId: number, value: number) => {
    try {
      const { error } = await supabase
        .from('habit_logs')
        .upsert({
          user_id: user?.id,
          habit_id: habitId,
          date: today,
          value,
        })

      if (error) throw error
      
      // Reload data to update the UI
      loadDashboardData()
      toast.success('Habit updated!')
    } catch (error) {
      console.error('Error updating habit:', error)
      toast.error('Failed to update habit')
    }
  }

  const handleQuickAdd = {
    content: async (data: any) => {
      try {
        const { error } = await supabase
          .from('content_logs')
          .insert({
            user_id: user?.id,
            date: today,
            ...data,
          })
        if (error) throw error
        loadDashboardData()
        toast.success('Content logged!')
      } catch (error) {
        toast.error('Failed to log content')
      }
    },
    deepWork: async (data: any) => {
      try {
        const { error } = await supabase
          .from('deepwork_logs')
          .insert({
            user_id: user?.id,
            start_time: new Date().toISOString(),
            ...data,
          })
        if (error) throw error
        loadDashboardData()
        toast.success('Deep work logged!')
      } catch (error) {
        toast.error('Failed to log deep work')
      }
    },
    rep: async (data: any) => {
      try {
        const { error } = await supabase
          .from('social_reps')
          .upsert({
            user_id: user?.id,
            date: today,
            count: (data.count || 1) + (data.todayStats?.socialReps || 0),
            notes: data.notes,
          })
        if (error) throw error
        loadDashboardData()
        toast.success('Social rep logged!')
      } catch (error) {
        toast.error('Failed to log social rep')
      }
    },
    workout: async (data: any) => {
      try {
        const { error } = await supabase
          .from('workouts')
          .insert({
            user_id: user?.id,
            date: today,
            ...data,
          })
        if (error) throw error
        loadDashboardData()
        toast.success('Workout logged!')
      } catch (error) {
        toast.error('Failed to log workout')
      }
    },
    sleep: async (data: any) => {
      try {
        const { error } = await supabase
          .from('sleep_logs')
          .upsert({
            user_id: user?.id,
            date: today,
            ...data,
          })
        if (error) throw error
        loadDashboardData()
        toast.success('Sleep logged!')
      } catch (error) {
        toast.error('Failed to log sleep')
      }
    },
    revenue: async (data: any) => {
      try {
        const { error } = await supabase
          .from('deals')
          .insert({
            user_id: user?.id,
            date: today,
            ...data,
          })
        if (error) throw error
        loadDashboardData()
        toast.success('Revenue logged!')
      } catch (error) {
        toast.error('Failed to log revenue')
      }
    },
    lead: async (data: any) => {
      try {
        const { error } = await supabase
          .from('leads')
          .insert({
            user_id: user?.id,
            ...data,
          })
        if (error) throw error
        toast.success('Lead added!')
      } catch (error) {
        toast.error('Failed to add lead')
      }
    },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const timeRemaining = () => {
    const now = new Date()
    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)
    const diff = endOfDay.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Today's Sprint</h1>
          <p className="text-muted-foreground">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {timeRemaining()} left
          </div>
          <StreakBadge count={data.streak} />
        </div>
      </div>

      {/* Motivational prompt */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-center italic">"{data.motivationalPrompt}"</p>
        </CardContent>
      </Card>

      {/* Daily Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Daily Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ProgressRing progress={data.todayScore} size={120}>
              <div className="text-center">
                <div className="text-2xl font-bold">{data.todayScore}</div>
                <div className="text-xs text-muted-foreground">/100</div>
              </div>
            </ProgressRing>
          </CardContent>
        </Card>

        {/* Today's Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{data.todayStats.content}</div>
              <div className="text-xs text-muted-foreground">Content</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{data.todayStats.deepWork}m</div>
              <div className="text-xs text-muted-foreground">Deep Work</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{data.todayStats.socialReps}</div>
              <div className="text-xs text-muted-foreground">Social Reps</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{data.todayStats.workouts}</div>
              <div className="text-xs text-muted-foreground">Workouts</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Add Bar */}
      <QuickAddBar
        onAddContent={handleQuickAdd.content}
        onAddDeepWork={handleQuickAdd.deepWork}
        onAddRep={handleQuickAdd.rep}
        onAddWorkout={handleQuickAdd.workout}
        onAddSleep={handleQuickAdd.sleep}
        onAddRevenue={handleQuickAdd.revenue}
        onAddLead={handleQuickAdd.lead}
      />

      {/* Habits Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Today's Habits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.habits.map((habit) => {
            const todayLog = data.habitLogs.find(log => log.habit_id === habit.id)
            return (
              <HabitCard
                key={habit.id}
                habit={habit}
                todayLog={todayLog}
                onUpdateLog={handleUpdateHabitLog}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}