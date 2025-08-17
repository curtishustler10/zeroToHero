'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/components/auth/auth-provider'
import { createClient } from '@/lib/supabase'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar,
  Brain,
  Zap,
  Heart,
  Users,
  DollarSign,
  Activity
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface ReportData {
  dailyScores: any[]
  weeklyTrends: any[]
  habitCompletion: any[]
  contentStats: any[]
  revenueData: any[]
  leadsData: any[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function ReportsPage() {
  const { user } = useAuth()
  const [reportData, setReportData] = useState<ReportData>({
    dailyScores: [],
    weeklyTrends: [],
    habitCompletion: [],
    contentStats: [],
    revenueData: [],
    leadsData: []
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30days')
  const [activeTab, setActiveTab] = useState('overview')
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadReportData()
    }
  }, [user, timeRange])

  const getDateRange = () => {
    const now = new Date()
    switch (timeRange) {
      case '7days':
        return { start: subDays(now, 7), end: now }
      case '30days':
        return { start: subDays(now, 30), end: now }
      case 'thisweek':
        return { start: startOfWeek(now), end: endOfWeek(now) }
      case 'thismonth':
        return { start: startOfMonth(now), end: endOfMonth(now) }
      default:
        return { start: subDays(now, 30), end: now }
    }
  }

  const loadReportData = async () => {
    try {
      const { start, end } = getDateRange()
      const startDate = format(start, 'yyyy-MM-dd')
      const endDate = format(end, 'yyyy-MM-dd')

      const [
        scoresRes,
        habitsRes,
        contentRes,
        dealsRes,
        leadsRes
      ] = await Promise.all([
        // Daily scores simulation - in real app you'd query v_daily_score view
        supabase
          .from('days')
          .select('*')
          .eq('user_id', user?.id)
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date'),
        supabase
          .from('habit_logs')
          .select(`
            *,
            habit:habits(name)
          `)
          .eq('user_id', user?.id)
          .gte('date', startDate)
          .lte('date', endDate),
        supabase
          .from('content_logs')
          .select('*')
          .eq('user_id', user?.id)
          .gte('date', startDate)
          .lte('date', endDate),
        supabase
          .from('deals')
          .select('*')
          .eq('user_id', user?.id)
          .gte('date', startDate)
          .lte('date', endDate),
        supabase
          .from('leads')
          .select('*')
          .eq('user_id', user?.id)
          .gte('created_at', `${startDate}T00:00:00`)
          .lte('created_at', `${endDate}T23:59:59`)
      ])

      // Process daily scores
      const dailyScores = scoresRes.data?.map(day => ({
        date: format(new Date(day.date), 'MMM dd'),
        score: day.mood ? day.mood * 20 : 0, // Simple score calculation
        mood: day.mood || 0
      })) || []

      // Process habit completion rates
      const habitCompletion = habitsRes.data?.reduce((acc: any, log: any) => {
        const habitName = log.habit?.name || 'Unknown'
        if (!acc[habitName]) {
          acc[habitName] = { name: habitName, completed: 0, total: 0 }
        }
        acc[habitName].total += 1
        if (log.value > 0) acc[habitName].completed += 1
        return acc
      }, {})

      const habitCompletionArray = Object.values(habitCompletion || {}).map((habit: any) => ({
        ...habit,
        percentage: Math.round((habit.completed / habit.total) * 100)
      }))

      // Process content stats by platform
      const contentStats = contentRes.data?.reduce((acc: any, content: any) => {
        const platform = content.platform || 'Other'
        if (!acc[platform]) {
          acc[platform] = { name: platform, count: 0 }
        }
        acc[platform].count += 1
        return acc
      }, {})

      const contentStatsArray = Object.values(contentStats || {})

      // Process revenue data
      const revenueData = dealsRes.data?.reduce((acc: any, deal: any) => {
        const date = format(new Date(deal.date), 'MMM dd')
        const existing = acc.find((item: any) => item.date === date)
        if (existing) {
          existing.revenue += deal.amount || 0
        } else {
          acc.push({ date, revenue: deal.amount || 0 })
        }
        return acc
      }, []) || []

      // Process leads data
      const leadsData = leadsRes.data?.reduce((acc: any, lead: any) => {
        const status = lead.status
        if (!acc[status]) {
          acc[status] = { name: status.replace('_', ' '), count: 0 }
        }
        acc[status].count += 1
        return acc
      }, {})

      const leadsDataArray = Object.values(leadsData || {})

      setReportData({
        dailyScores,
        weeklyTrends: dailyScores, // Same data for now
        habitCompletion: habitCompletionArray,
        contentStats: contentStatsArray,
        revenueData,
        leadsData: leadsDataArray
      })
    } catch (error) {
      console.error('Error loading report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTrendDirection = (data: any[]) => {
    if (data.length < 2) return 'neutral'
    const first = data[0]?.score || 0
    const last = data[data.length - 1]?.score || 0
    return last > first ? 'up' : last < first ? 'down' : 'neutral'
  }

  const getAverageScore = () => {
    if (reportData.dailyScores.length === 0) return 0
    const total = reportData.dailyScores.reduce((sum, day) => sum + day.score, 0)
    return Math.round(total / reportData.dailyScores.length)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const trendDirection = getTrendDirection(reportData.dailyScores)
  const averageScore = getAverageScore()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Track your progress and insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="thisweek">This week</SelectItem>
            <SelectItem value="thismonth">This month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-2xl font-bold">{averageScore}</p>
                  </div>
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-center mt-2 text-xs">
                  {trendDirection === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : trendDirection === 'down' ? (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  ) : null}
                  <span className={trendDirection === 'up' ? 'text-green-500' : trendDirection === 'down' ? 'text-red-500' : 'text-muted-foreground'}>
                    {trendDirection === 'up' ? 'Trending up' : trendDirection === 'down' ? 'Trending down' : 'Stable'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Content Created</p>
                    <p className="text-2xl font-bold">{reportData.contentStats.reduce((sum: number, item: any) => sum + item.count, 0)}</p>
                  </div>
                  <Brain className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">${reportData.revenueData.reduce((sum: number, item: any) => sum + item.revenue, 0).toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">New Leads</p>
                    <p className="text-2xl font-bold">{reportData.leadsData.reduce((sum: number, item: any) => sum + item.count, 0)}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={reportData.dailyScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mood Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.dailyScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[1, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="mood" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="habits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Habit Completion Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={reportData.habitCompletion}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
                  <Bar dataKey="percentage" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.contentStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {reportData.contentStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Production</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.contentStats.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="text-muted-foreground">{item.count} pieces</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.leadsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {reportData.leadsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}