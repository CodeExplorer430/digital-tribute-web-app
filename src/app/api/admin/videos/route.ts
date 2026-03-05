import { assertPageOwnership, databaseError, forbidden, requireAdminUser } from '@/lib/server/admin-auth'
import { getYoutubeId } from '@/lib/server/youtube'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const videoSchema = z.object({
  pageId: z.string().uuid(),
  url: z.string().trim().url(),
  title: z.string().trim().max(120).optional().default(''),
})

export async function POST(request: NextRequest) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ code: 'INVALID_JSON', message: 'Invalid request payload.' }, { status: 400 })
  }

  const parsed = videoSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { code: 'VALIDATION_ERROR', message: 'Enter a valid YouTube URL and optional title.' },
      { status: 400 }
    )
  }

  const auth = await requireAdminUser()
  if (!auth.ok) return auth.response
  const { supabase, userId } = auth

  const { pageId, url, title } = parsed.data
  const videoId = getYoutubeId(url)

  if (!videoId) {
    return NextResponse.json({ code: 'INVALID_VIDEO_URL', message: 'Invalid YouTube URL.' }, { status: 400 })
  }

  const ownsPage = await assertPageOwnership(supabase, pageId, userId)
  if (!ownsPage) return forbidden('You do not have access to this page.')

  const { data, error } = await supabase
    .from('videos')
    .insert({
      page_id: pageId,
      provider: 'youtube',
      provider_id: videoId,
      title: title || null,
    })
    .select('id, provider_id, title, created_at')
    .single()

  if (error) {
    return databaseError('Unable to add video right now.')
  }

  return NextResponse.json({ video: data }, { status: 201 })
}
