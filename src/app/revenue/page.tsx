'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/components/auth/auth-provider'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'
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
  Cell
} from 'recharts'
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Calendar,
  Filter,
  Edit,
  Trash2
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Deal {
  id: number
  title: string
  amount: number
  status: 'pending' | 'won' | 'lost'
  probability: number
  close_date: string
  client_name?: string
  notes?: string
  created_at: string
}

interface RevenueStats {
  totalRevenue: number
  monthlyRevenue: number
  avgDealSize: number
  winRate: number
  pipeline: number
  deals: Deal[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function RevenuePage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<RevenueStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    avgDealSize: 0,
    winRate: 0,
    pipeline: 0,
    deals: []
  })
  const [loading, setLoading] = useState(true)
  const [isAddingDeal, setIsAddingDeal] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [timeFilter, setTimeFilter] = useState('all')
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadRevenueData()
    }
  }, [user, timeFilter])

  const loadRevenueData = async () => {
    try {
      let query = supabase
        .from('deals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (timeFilter === 'this_month') {
        const start = startOfMonth(new Date())
        const end = endOfMonth(new Date())
        query = query
          .gte('created_at', format(start, 'yyyy-MM-dd'))
          .lte('created_at', format(end, 'yyyy-MM-dd'))
      } else if (timeFilter === 'last_30_days') {
        const start = subDays(new Date(), 30)
        query = query.gte('created_at', format(start, 'yyyy-MM-dd'))
      }

      const { data: deals, error } = await query

      if (error) throw error

      const allDeals = deals || []
      const wonDeals = allDeals.filter(deal => deal.status === 'won')
      const pendingDeals = allDeals.filter(deal => deal.status === 'pending')

      const totalRevenue = wonDeals.reduce((sum, deal) => sum + (deal.amount || 0), 0)
      const monthlyRevenue = wonDeals
        .filter(deal => {
          const dealDate = new Date(deal.created_at)
          const currentMonth = new Date().getMonth()
          const currentYear = new Date().getFullYear()
          return dealDate.getMonth() === currentMonth && dealDate.getFullYear() === currentYear
        })
        .reduce((sum, deal) => sum + (deal.amount || 0), 0)

      const avgDealSize = wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0
      const winRate = allDeals.length > 0 ? (wonDeals.length / allDeals.length) * 100 : 0
      const pipeline = pendingDeals.reduce((sum, deal) => sum + (deal.amount || 0) * (deal.probability || 50) / 100, 0)

      setStats({
        totalRevenue,
        monthlyRevenue,
        avgDealSize,
        winRate,
        pipeline,
        deals: allDeals
      })
    } catch (error) {
      console.error('Error loading revenue data:', error)
      toast.error('Failed to load revenue data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddDeal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      const { error } = await supabase
        .from('deals')
        .insert({
          user_id: user?.id,
          title: formData.get('title') as string,
          amount: parseFloat(formData.get('amount') as string),
          status: formData.get('status') as string,
          probability: parseInt(formData.get('probability') as string),
          close_date: formData.get('close_date') as string,
          client_name: formData.get('client_name') as string || null,
          notes: formData.get('notes') as string || null,
        })

      if (error) throw error
      
      setIsAddingDeal(false)
      loadRevenueData()
      toast.success('Deal added successfully!')
      e.currentTarget.reset()
    } catch (error) {
      console.error('Error adding deal:', error)
      toast.error('Failed to add deal')
    }
  }

  const handleUpdateDeal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingDeal) return
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const { error } = await supabase
        .from('deals')
        .update({
          title: formData.get('title') as string,
          amount: parseFloat(formData.get('amount') as string),
          status: formData.get('status') as string,
          probability: parseInt(formData.get('probability') as string),
          close_date: formData.get('close_date') as string,
          client_name: formData.get('client_name') as string || null,
          notes: formData.get('notes') as string || null,
        })
        .eq('id', editingDeal.id)

      if (error) throw error
      
      setEditingDeal(null)
      loadRevenueData()
      toast.success('Deal updated successfully!')
    } catch (error) {
      console.error('Error updating deal:', error)
      toast.error('Failed to update deal')
    }
  }

  const handleDeleteDeal = async (dealId: number) => {
    if (!confirm('Are you sure you want to delete this deal?')) return
    
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId)

      if (error) throw error
      
      loadRevenueData()
      toast.success('Deal deleted successfully!')
    } catch (error) {
      console.error('Error deleting deal:', error)
      toast.error('Failed to delete deal')
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'lost':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Target className="h-4 w-4 text-yellow-600" />
    }
  }

  const filteredDeals = stats.deals.filter(deal => 
    statusFilter === 'all' || deal.status === statusFilter
  )

  const chartData = stats.deals
    .reduce((acc: any[], deal) => {
      const month = format(new Date(deal.created_at), 'MMM yyyy')
      const existing = acc.find(item => item.month === month)
      
      if (existing) {
        if (deal.status === 'won') {
          existing.revenue += deal.amount || 0
        }
        existing.deals += 1
      } else {
        acc.push({
          month,
          revenue: deal.status === 'won' ? deal.amount || 0 : 0,
          deals: 1
        })
      }
      return acc
    }, [])
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

  const statusData = [
    { name: 'Won', value: stats.deals.filter(d => d.status === 'won').length, color: '#00C49F' },
    { name: 'Pending', value: stats.deals.filter(d => d.status === 'pending').length, color: '#FFBB28' },
    { name: 'Lost', value: stats.deals.filter(d => d.status === 'lost').length, color: '#FF8042' },
  ].filter(item => item.value > 0)

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
          <h1 className="text-2xl font-bold">Revenue Tracking</h1>
          <p className="text-muted-foreground">Track deals and monitor revenue performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddingDeal} onOpenChange={setIsAddingDeal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Deal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddDeal} className="space-y-4">
                <div>
                  <Label htmlFor="title">Deal Title *</Label>
                  <Input id="title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="amount">Amount *</Label>
                  <Input id="amount" name="amount" type="number" step="0.01" required />
                </div>
                <div>
                  <Label htmlFor="client_name">Client Name</Label>
                  <Input id="client_name" name="client_name" />
                </div>
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select name="status" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="probability">Probability (%) *</Label>
                  <Input 
                    id="probability" 
                    name="probability" 
                    type="number" 
                    min="0" 
                    max="100" 
                    defaultValue="50"
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="close_date">Expected Close Date</Label>
                  <Input id="close_date" name="close_date" type="date" />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" name="notes" rows={3} />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">Add Deal</Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddingDeal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Deal Size</p>
                <p className="text-2xl font-bold">${Math.round(stats.avgDealSize).toLocaleString()}</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">{Math.round(stats.winRate)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pipeline Value</p>
                <p className="text-2xl font-bold">${Math.round(stats.pipeline).toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="deals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deals">Deals ({filteredDeals.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="deals" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDeals.map((deal) => (
              <Card key={deal.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{deal.title}</CardTitle>
                      {deal.client_name && (
                        <p className="text-sm text-muted-foreground">{deal.client_name}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(deal.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                        {deal.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Amount:</span>
                    <span className="font-semibold">${deal.amount?.toLocaleString()}</span>
                  </div>
                  {deal.status === 'pending' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Probability:</span>
                      <span className="text-sm">{deal.probability}%</span>
                    </div>
                  )}
                  {deal.close_date && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Close Date:</span>
                      <span className="text-sm">{format(new Date(deal.close_date), 'MMM dd, yyyy')}</span>
                    </div>
                  )}
                  {deal.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{deal.notes}</p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingDeal(deal)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteDeal(deal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deal Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
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

      {editingDeal && (
        <Dialog open={true} onOpenChange={() => setEditingDeal(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Deal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateDeal} className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Deal Title *</Label>
                <Input 
                  id="edit-title" 
                  name="title" 
                  defaultValue={editingDeal.title}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="edit-amount">Amount *</Label>
                <Input 
                  id="edit-amount" 
                  name="amount" 
                  type="number" 
                  step="0.01"
                  defaultValue={editingDeal.amount}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="edit-client">Client Name</Label>
                <Input 
                  id="edit-client" 
                  name="client_name" 
                  defaultValue={editingDeal.client_name || ''}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status *</Label>
                <Select name="status" defaultValue={editingDeal.status} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-probability">Probability (%) *</Label>
                <Input 
                  id="edit-probability" 
                  name="probability" 
                  type="number" 
                  min="0" 
                  max="100"
                  defaultValue={editingDeal.probability}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="edit-close-date">Expected Close Date</Label>
                <Input 
                  id="edit-close-date" 
                  name="close_date" 
                  type="date"
                  defaultValue={editingDeal.close_date ? format(new Date(editingDeal.close_date), 'yyyy-MM-dd') : ''}
                />
              </div>
              <div>
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea 
                  id="edit-notes" 
                  name="notes" 
                  rows={3}
                  defaultValue={editingDeal.notes || ''}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Update Deal</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditingDeal(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}