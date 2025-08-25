import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Self-Love',
}

export default function SelfLovePage() {
  redirect('/self-love.html')
}
