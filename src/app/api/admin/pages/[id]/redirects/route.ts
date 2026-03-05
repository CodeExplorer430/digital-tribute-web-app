import { databaseError, forbidden, requireAdminUser } from '@/lib/server/admin-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const paramsSchema = z.object({ id: z.string().uuid() })

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params
  const parsed = paramsSchema.safeParse(params)
  if (!parsed.success) {
    return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid page id.' }, { status: 400 })
  }

  const auth = await requireAdminUser()
  if (!auth.ok) return auth.response
  const { supabase, userId } = auth

  const { data: page } = await supabase
    .from('pages')
    .select('id, slug')
    .eq('id', parsed.data.id)
    .eq('owner_id', userId)
    .single()

  if (!page) return forbidden('You do not have access to this page.')

  const { data, error } = await supabase
    .from('redirects')
    .select('id, shortcode, target_url, created_at')
    .eq('created_by', userId)
    .ilike('target_url', `%${page.slug}%`)
    .order('created_at', { ascending: false })

  if (error) {
    return databaseError('Unable to load redirects.')
  }

  return NextResponse.json({ redirects: data ?? [] }, { status: 200 })
}
