import { assertPageOwnership, databaseError, forbidden, requireAdminUser } from '@/lib/server/admin-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const timelineSchema = z.object({
  pageId: z.string().uuid(),
  year: z.number().int().min(1000).max(2100),
  text: z.string().trim().min(1).max(500),
})

export async function POST(request: NextRequest) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ code: 'INVALID_JSON', message: 'Invalid request payload.' }, { status: 400 })
  }

  const parsed = timelineSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { code: 'VALIDATION_ERROR', message: 'Enter a valid year and timeline description.' },
      { status: 400 }
    )
  }

  const auth = await requireAdminUser()
  if (!auth.ok) return auth.response
  const { supabase, userId } = auth

  const { pageId, year, text } = parsed.data
  const ownsPage = await assertPageOwnership(supabase, pageId, userId)
  if (!ownsPage) return forbidden('You do not have access to this page.')

  const { data, error } = await supabase
    .from('timeline_events')
    .insert({
      page_id: pageId,
      year,
      text,
    })
    .select('id, year, text, page_id')
    .single()

  if (error) {
    return databaseError('Unable to add timeline event.')
  }

  return NextResponse.json({ event: data }, { status: 201 })
}
