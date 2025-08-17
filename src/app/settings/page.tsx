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
import { 
  User, 
  Bell, 
  Target, 
  Palette, 
  Shield,
  Download,
  Trash2,
  Save
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface UserProfile {
  id: string
  display_name?: string
  goal_desc?: string
  tz: string
}

interface HabitTemplate {
  id: number
  name: string
  description?: string
  target_value: number
  unit: string
  category: string
  is_active: boolean
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [habits, setHabits] = useState<HabitTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    try {
      const [profileRes, habitsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single(),
        supabase
          .from('habits')
          .select('*')
          .eq('user_id', user?.id)
          .order('sort_order')
      ])

      if (profileRes.data) {
        setProfile(profileRes.data)
      }

      if (habitsRes.data) {
        setHabits(habitsRes.data)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          display_name: formData.get('display_name') as string,
          goal_desc: formData.get('goal_desc') as string,
          tz: formData.get('tz') as string,
        })

      if (error) throw error
      
      toast.success('Profile updated successfully!')
      loadUserData()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleAddHabit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      const { error } = await supabase
        .from('habits')
        .insert({
          user_id: user?.id,
          name: formData.get('name') as string,
          description: formData.get('description') as string || null,
          target_value: parseInt(formData.get('target_value') as string),
          unit: formData.get('unit') as string,
          category: formData.get('category') as string,
          is_active: true,
          sort_order: habits.length + 1
        })

      if (error) throw error
      
      loadUserData()
      toast.success('Habit added successfully!')
      e.currentTarget.reset()
    } catch (error) {
      console.error('Error adding habit:', error)
      toast.error('Failed to add habit')
    }
  }

  const handleDeleteHabit = async (habitId: number) => {
    if (!confirm('Are you sure you want to delete this habit?')) return
    
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId)

      if (error) throw error
      
      loadUserData()
      toast.success('Habit deleted successfully!')
    } catch (error) {
      console.error('Error deleting habit:', error)
      toast.error('Failed to delete habit')
    }
  }

  const handleToggleHabit = async (habitId: number, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('habits')
        .update({ is_active: !isActive })
        .eq('id', habitId)

      if (error) throw error
      
      loadUserData()
      toast.success(`Habit ${!isActive ? 'activated' : 'deactivated'}!`)
    } catch (error) {
      console.error('Error toggling habit:', error)
      toast.error('Failed to update habit')
    }
  }

  const handleExportData = async () => {
    try {
      const [
        profileRes,
        habitsRes,
        habitLogsRes,
        contentRes,
        dealsRes,
        leadsRes
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user?.id),
        supabase.from('habits').select('*').eq('user_id', user?.id),
        supabase.from('habit_logs').select('*').eq('user_id', user?.id),
        supabase.from('content_logs').select('*').eq('user_id', user?.id),
        supabase.from('deals').select('*').eq('user_id', user?.id),
        supabase.from('leads').select('*').eq('user_id', user?.id)
      ])

      const exportData = {
        profile: profileRes.data,
        habits: habitsRes.data,
        habit_logs: habitLogsRes.data,
        content_logs: contentRes.data,
        deals: dealsRes.data,
        leads: leadsRes.data,
        exported_at: new Date().toISOString()
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `sprint_coach_data_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success('Data exported successfully!')
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Failed to export data')
    }
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
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="data">Data & Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed from this interface
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input 
                    id="display_name" 
                    name="display_name"
                    defaultValue={profile?.display_name || ''}
                    placeholder="Enter your display name"
                  />
                </div>

                <div>
                  <Label htmlFor="tz">Timezone</Label>
                  <Select name="tz" defaultValue={profile?.tz || 'Australia/Brisbane'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Australia/Brisbane">Australia/Brisbane</SelectItem>
                      <SelectItem value="Australia/Sydney">Australia/Sydney</SelectItem>
                      <SelectItem value="Australia/Melbourne">Australia/Melbourne</SelectItem>
                      <SelectItem value="Australia/Perth">Australia/Perth</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="goal_desc">Goal Description</Label>
                  <Textarea 
                    id="goal_desc" 
                    name="goal_desc"
                    defaultValue={profile?.goal_desc || ''}
                    placeholder="Describe your main goals and what you're working towards..."
                    rows={4}
                  />
                </div>

                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habits" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Habit</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddHabit} className="space-y-4">
                  <div>
                    <Label htmlFor="habit-name">Habit Name *</Label>
                    <Input id="habit-name" name="name" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="habit-description">Description</Label>
                    <Textarea id="habit-description" name="description" rows={2} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="target-value">Target Value *</Label>
                      <Input 
                        id="target-value" 
                        name="target_value" 
                        type="number" 
                        min="1"
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="unit">Unit *</Label>
                      <Select name="unit" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="times">Times</SelectItem>
                          <SelectItem value="minutes">Minutes</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="pages">Pages</SelectItem>
                          <SelectItem value="glasses">Glasses</SelectItem>
                          <SelectItem value="servings">Servings</SelectItem>
                          <SelectItem value="reps">Reps</SelectItem>
                          <SelectItem value="sets">Sets</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="learning">Learning</SelectItem>
                        <SelectItem value="productivity">Productivity</SelectItem>
                        <SelectItem value="mindfulness">Mindfulness</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full">
                    Add Habit
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Habits ({habits.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {habits.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No habits created yet. Add your first habit to get started!
                    </p>
                  ) : (
                    habits.map((habit) => (
                      <div 
                        key={habit.id} 
                        className={`p-3 border rounded-lg ${habit.is_active ? 'bg-background' : 'bg-muted/50'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`font-medium ${!habit.is_active ? 'text-muted-foreground' : ''}`}>
                              {habit.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Target: {habit.target_value} {habit.unit} • {habit.category}
                            </p>
                            {habit.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {habit.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleHabit(habit.id, habit.is_active)}
                            >
                              {habit.is_active ? 'Pause' : 'Resume'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteHabit(habit.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Notification preferences are managed through your browser settings and will be implemented in a future update.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Theme customization options will be available in a future update.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Goal Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Daily Score Target</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your target daily score (out of 100 points)
                  </p>
                  <Input type="number" defaultValue="70" disabled />
                  <p className="text-xs text-muted-foreground mt-1">
                    This setting will be customizable in a future update
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Download all your data in JSON format. This includes your profile, habits, logs, deals, and leads.
                </p>
                <Button onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Data Privacy</h4>
                  <p className="text-sm text-muted-foreground">
                    Your data is stored securely and is only accessible to you. We do not share your personal information with third parties.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Account Security</h4>
                  <p className="text-sm text-muted-foreground">
                    Authentication is handled by Supabase with industry-standard security practices.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="destructive" disabled>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account (Coming Soon)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}