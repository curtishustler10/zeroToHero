'use client'

import { Sidebar } from './sidebar'
import { useAuth } from '@/components/auth/auth-provider'
import { AuthForm } from '@/components/auth/auth-form'
import { Toaster } from '@/components/ui/sonner'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <AuthForm />
        <Toaster />
      </>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <Toaster />
    </div>
  )
}