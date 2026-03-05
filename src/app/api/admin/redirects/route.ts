import { databaseError, requireAdminUser } from '@/lib/server/admin-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const redirectSchema = z.object({
  shortcode: z.string().trim().toLowerCase().regex(/^[a-z0-9-]{3,32}$/),
  targetUrl: z.string().trim().url(),
})

export async function GET() {
  const auth = await requireAdminUser()
  if (!auth.ok) return auth.response
  const { supabase, userId } = auth

  const { data, error } = await supabase
    .from('redirects')
    .select('id, shortcode, target_url, created_at')
    .eq('created_by', userId)
    .order('created_at', { ascending: false })

  if (error) {
    return databaseError('Unable to load redirects.')
  }

  return NextResponse.json({ redirects: data ?? [] }, { status: 200 })
}

export async function POST(request: NextRequest) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ code: 'INVALID_JSON', message: 'Invalid request payload.' }, { status: 400 })
  }

  const parsed = redirectSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { code: 'VALIDATION_ERROR', message: 'Enter a valid short code and URL.' },
      { status: 400 }
    )
  }

  const auth = await requireAdminUser()
  if (!auth.ok) return auth.response
  const { supabase, userId } = auth

  const { shortcode, targetUrl } = parsed.data
  const { data, error } = await supabase
    .from('redirects')
    .insert({
      shortcode,
      target_url: targetUrl,
      created_by: userId,
    })
    .select('id, shortcode, target_url, created_at')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ code: 'SHORTCODE_EXISTS', message: 'This short code is already in use.' }, { status: 409 })
    }
    return databaseError('Unable to create redirect right now.')
  }

  return NextResponse.json({ redirect: data }, { status: 201 })
}
