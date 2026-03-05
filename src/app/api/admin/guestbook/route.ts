import { databaseError, requireAdminUser } from '@/lib/server/admin-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const auth = await requireAdminUser()
  if (!auth.ok) return auth.response
  const { supabase, userId } = auth

  const { data, error } = await supabase
    .from('guestbook')
    .select('id, name, message, is_approved, created_at, pages!inner(title, owner_id)')
    .eq('pages.owner_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    return databaseError('Unable to load guestbook entries.')
  }

  return NextResponse.json({ entries: data ?? [] }, { status: 200 })
}
