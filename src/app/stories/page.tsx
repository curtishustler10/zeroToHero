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
import { format } from 'date-fns'
import { 
  Plus, 
  BookOpen, 
  Edit, 
  Trash2, 
  Copy,
  Search,
  Filter,
  Tag,
  Calendar,
  ExternalLink
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Story {
  id: number
  title: string
  content: string
  category: string
  tags?: string[]
  platform?: string
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export default function StoriesPage() {
  const { user } = useAuth()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingStory, setIsAddingStory] = useState(false)
  const [editingStory, setEditingStory] = useState<Story | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadStories()
    }
  }, [user])

  const loadStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setStories(data || [])
    } catch (error) {
      console.error('Error loading stories:', error)
      toast.error('Failed to load stories')
    } finally {
      setLoading(false)
    }
  }

  const handleAddStory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const tagsInput = formData.get('tags') as string
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(Boolean) : []
    
    try {
      const { error } = await supabase
        .from('stories')
        .insert({
          user_id: user?.id,
          title: formData.get('title') as string,
          content: formData.get('content') as string,
          category: formData.get('category') as string,
          tags,
          platform: formData.get('platform') as string || null,
          status: 'draft'
        })

      if (error) throw error
      
      setIsAddingStory(false)
      loadStories()
      toast.success('Story added successfully!')
      e.currentTarget.reset()
    } catch (error) {
      console.error('Error adding story:', error)
      toast.error('Failed to add story')
    }
  }

  const handleUpdateStory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingStory) return
    
    const formData = new FormData(e.currentTarget)
    const tagsInput = formData.get('tags') as string
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(Boolean) : []
    
    try {
      const { error } = await supabase
        .from('stories')
        .update({
          title: formData.get('title') as string,
          content: formData.get('content') as string,
          category: formData.get('category') as string,
          tags,
          platform: formData.get('platform') as string || null,
          status: formData.get('status') as string,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingStory.id)

      if (error) throw error
      
      setEditingStory(null)
      loadStories()
      toast.success('Story updated successfully!')
    } catch (error) {
      console.error('Error updating story:', error)
      toast.error('Failed to update story')
    }
  }

  const handleDeleteStory = async (storyId: number) => {
    if (!confirm('Are you sure you want to delete this story?')) return
    
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId)

      if (error) throw error
      
      loadStories()
      toast.success('Story deleted successfully!')
    } catch (error) {
      console.error('Error deleting story:', error)
      toast.error('Failed to delete story')
    }
  }

  const handleCopyStory = async (story: Story) => {
    try {
      await navigator.clipboard.writeText(story.content)
      toast.success('Story copied to clipboard!')
    } catch (error) {
      console.error('Error copying story:', error)
      toast.error('Failed to copy story')
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = categoryFilter === 'all' || story.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || story.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = [...new Set(stories.map(story => story.category))].filter(Boolean)
  const storyStats = {
    total: stories.length,
    drafts: stories.filter(s => s.status === 'draft').length,
    published: stories.filter(s => s.status === 'published').length,
    archived: stories.filter(s => s.status === 'archived').length,
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
          <h1 className="text-2xl font-bold">Story Bank</h1>
          <p className="text-muted-foreground">Manage your content stories and ideas</p>
        </div>
        <Dialog open={isAddingStory} onOpenChange={setIsAddingStory}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Story
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Story</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddStory} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" required />
              </div>
              
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  rows={8}
                  placeholder="Write your story content here..."
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="motivational">Motivational</SelectItem>
                      <SelectItem value="humor">Humor</SelectItem>
                      <SelectItem value="testimonial">Testimonial</SelectItem>
                      <SelectItem value="behind_the_scenes">Behind the Scenes</SelectItem>
                      <SelectItem value="tips">Tips & Advice</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select name="platform">
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input 
                  id="tags" 
                  name="tags" 
                  placeholder="e.g. motivation, success, leadership"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Add Story</Button>
                <Button type="button" variant="outline" onClick={() => setIsAddingStory(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{storyStats.total}</div>
            <div className="text-xs text-muted-foreground">Total Stories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{storyStats.drafts}</div>
            <div className="text-xs text-muted-foreground">Drafts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{storyStats.published}</div>
            <div className="text-xs text-muted-foreground">Published</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{storyStats.archived}</div>
            <div className="text-xs text-muted-foreground">Archived</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStories.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' 
                  ? 'No stories match your filters'
                  : 'No stories yet. Create your first story to get started!'
                }
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredStories.map((story) => (
            <Card key={story.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{story.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(story.status)}`}>
                        {story.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {story.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {story.content}
                </p>
                
                {story.tags && story.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {story.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-xs"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                    {story.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{story.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(story.updated_at), 'MMM dd, yyyy')}
                  </div>
                  {story.platform && (
                    <div className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      {story.platform}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingStory(story)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyStory(story)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteStory(story.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {editingStory && (
        <Dialog open={true} onOpenChange={() => setEditingStory(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Story</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateStory} className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title *</Label>
                <Input 
                  id="edit-title" 
                  name="title" 
                  defaultValue={editingStory.title}
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="edit-content">Content *</Label>
                <Textarea 
                  id="edit-content" 
                  name="content" 
                  rows={8}
                  defaultValue={editingStory.content}
                  required 
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select name="category" defaultValue={editingStory.category} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="motivational">Motivational</SelectItem>
                      <SelectItem value="humor">Humor</SelectItem>
                      <SelectItem value="testimonial">Testimonial</SelectItem>
                      <SelectItem value="behind_the_scenes">Behind the Scenes</SelectItem>
                      <SelectItem value="tips">Tips & Advice</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-platform">Platform</Label>
                  <Select name="platform" defaultValue={editingStory.platform || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-status">Status *</Label>
                  <Select name="status" defaultValue={editingStory.status} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                <Input 
                  id="edit-tags" 
                  name="tags" 
                  defaultValue={editingStory.tags?.join(', ') || ''}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Update Story</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditingStory(null)}
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