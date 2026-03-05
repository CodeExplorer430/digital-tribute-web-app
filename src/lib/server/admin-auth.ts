import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export type AdminSupabase = Awaited<ReturnType<typeof createClient>>

export async function requireAdminUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      ok: false as const,
      response: NextResponse.json({ code: 'UNAUTHORIZED', message: 'You must be signed in.' }, { status: 401 }),
    }
  }

  return { ok: true as const, supabase, userId: user.id }
}

export function forbidden(message: string) {
  return NextResponse.json({ code: 'FORBIDDEN', message }, { status: 403 })
}

export function databaseError(message: string) {
  return NextResponse.json({ code: 'DATABASE_ERROR', message }, { status: 500 })
}

export async function assertPageOwnership(supabase: AdminSupabase, pageId: string, userId: string) {
  const { data: page } = await supabase.from('pages').select('id').eq('id', pageId).eq('owner_id', userId).single()
  return Boolean(page)
}

export async function getOwnedPage(supabase: AdminSupabase, pageId: string, userId: string) {
  const { data: page } = await supabase
    .from('pages')
    .select('id, title, slug, full_name, dob, dod, privacy, hero_image_url')
    .eq('id', pageId)
    .eq('owner_id', userId)
    .single()
  return page
}

export async function assertOwnedRowByPageId(
  supabase: AdminSupabase,
  table: 'guestbook' | 'timeline_events' | 'videos' | 'photos',
  rowId: string,
  userId: string
) {
  const { data: row } = await supabase.from(table).select('id, page_id').eq('id', rowId).single()
  if (!row) return false

  return assertPageOwnership(supabase, row.page_id, userId)
}
