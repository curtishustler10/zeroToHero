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
import { 
  Plus, 
  Users, 
  MessageSquare, 
  Target, 
  Calendar,
  Mail,
  Phone,
  ExternalLink,
  Filter
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Lead {
  id: number
  name: string
  email: string
  phone?: string
  company?: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed_won' | 'closed_lost'
  source: string
  notes?: string
  created_at: string
  last_contact?: string
}

interface OutreachLog {
  id: number
  lead_id: number
  type: 'email' | 'call' | 'meeting' | 'social'
  message: string
  response?: string
  created_at: string
  lead?: Lead
}

export default function LeadsPage() {
  const { user } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [outreachLogs, setOutreachLogs] = useState<OutreachLog[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingLead, setIsAddingLead] = useState(false)
  const [isAddingOutreach, setIsAddingOutreach] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      const [leadsRes, outreachRes] = await Promise.all([
        supabase
          .from('leads')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('outreach_logs')
          .select(`
            *,
            lead:leads(*)
          `)
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(20)
      ])

      if (leadsRes.error) throw leadsRes.error
      if (outreachRes.error) throw outreachRes.error

      setLeads(leadsRes.data || [])
      setOutreachLogs(outreachRes.data || [])
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load leads data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          user_id: user?.id,
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string || null,
          company: formData.get('company') as string || null,
          status: 'new',
          source: formData.get('source') as string,
          notes: formData.get('notes') as string || null,
        })

      if (error) throw error
      
      setIsAddingLead(false)
      loadData()
      toast.success('Lead added successfully!')
      e.currentTarget.reset()
    } catch (error) {
      console.error('Error adding lead:', error)
      toast.error('Failed to add lead')
    }
  }

  const handleAddOutreach = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      const { error } = await supabase
        .from('outreach_logs')
        .insert({
          user_id: user?.id,
          lead_id: selectedLead?.id,
          type: formData.get('type') as string,
          message: formData.get('message') as string,
          response: formData.get('response') as string || null,
        })

      if (error) throw error
      
      setIsAddingOutreach(false)
      setSelectedLead(null)
      loadData()
      toast.success('Outreach logged!')
      e.currentTarget.reset()
    } catch (error) {
      console.error('Error adding outreach:', error)
      toast.error('Failed to log outreach')
    }
  }

  const updateLeadStatus = async (leadId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId)

      if (error) throw error
      
      loadData()
      toast.success('Lead status updated!')
    } catch (error) {
      console.error('Error updating lead status:', error)
      toast.error('Failed to update lead status')
    }
  }

  const filteredLeads = leads.filter(lead => 
    statusFilter === 'all' || lead.status === statusFilter
  )

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-purple-100 text-purple-800',
      proposal: 'bg-orange-100 text-orange-800',
      closed_won: 'bg-green-100 text-green-800',
      closed_lost: 'bg-red-100 text-red-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
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
          <h1 className="text-2xl font-bold">Leads & Outreach</h1>
          <p className="text-muted-foreground">Manage your leads and track outreach efforts</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddingLead} onOpenChange={setIsAddingLead}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddLead} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" />
                </div>
                <div>
                  <Label htmlFor="source">Source *</Label>
                  <Select name="source" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="cold_outreach">Cold Outreach</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" name="notes" rows={3} />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">Add Lead</Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddingLead(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads">Leads ({filteredLeads.length})</TabsTrigger>
          <TabsTrigger value="outreach">Recent Outreach ({outreachLogs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="closed_won">Closed Won</SelectItem>
                <SelectItem value="closed_lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{lead.name}</CardTitle>
                      {lead.company && (
                        <p className="text-sm text-muted-foreground">{lead.company}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status.replace('_', ' ')}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Source: {lead.source.replace('_', ' ')}
                  </div>
                  {lead.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{lead.notes}</p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Select 
                      value={lead.status} 
                      onValueChange={(value) => updateLeadStatus(lead.id, value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="closed_won">Closed Won</SelectItem>
                        <SelectItem value="closed_lost">Closed Lost</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedLead(lead)
                        setIsAddingOutreach(true)
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="outreach" className="space-y-4">
          <div className="space-y-4">
            {outreachLogs.map((log) => (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        log.type === 'email' ? 'bg-blue-500' :
                        log.type === 'call' ? 'bg-green-500' :
                        log.type === 'meeting' ? 'bg-purple-500' :
                        'bg-orange-500'
                      }`} />
                      <span className="font-medium">{log.lead?.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{log.message}</p>
                  {log.response && (
                    <div className="bg-green-50 p-2 rounded text-sm">
                      <strong>Response:</strong> {log.response}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddingOutreach} onOpenChange={setIsAddingOutreach}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Outreach - {selectedLead?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddOutreach} className="space-y-4">
            <div>
              <Label htmlFor="type">Type *</Label>
              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message">Message/Notes *</Label>
              <Textarea id="message" name="message" rows={3} required />
            </div>
            <div>
              <Label htmlFor="response">Response (if any)</Label>
              <Textarea id="response" name="response" rows={2} />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">Log Outreach</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddingOutreach(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}