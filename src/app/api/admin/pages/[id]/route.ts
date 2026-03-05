import { assertPageOwnership, databaseError, forbidden, getOwnedPage, requireAdminUser } from '@/lib/server/admin-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const paramsSchema = z.object({
  id: z.string().uuid(),
})

const pageUpdateSchema = z
  .object({
    title: z.string().trim().min(2).max(120).optional(),
    slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]{3,80}$/).optional(),
    fullName: z.string().trim().max(120).nullable().optional(),
    dob: z.string().nullable().optional(),
    dod: z.string().nullable().optional(),
    privacy: z.enum(['public', 'private']).optional(),
    heroImageUrl: z.string().trim().url().nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, { message: 'No fields to update.' })

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params
  const parsedParams = paramsSchema.safeParse(params)
  if (!parsedParams.success) {
    return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid page id.' }, { status: 400 })
  }

  const auth = await requireAdminUser()
  if (!auth.ok) return auth.response
  const { supabase, userId } = auth

  const pageId = parsedParams.data.id
  const page = await getOwnedPage(supabase, pageId, userId)
  const error = !page

  if (error || !page) return forbidden('You do not have access to this page.')

  return NextResponse.json({ page }, { status: 200 })
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params
  const parsedParams = paramsSchema.safeParse(params)
  if (!parsedParams.success) {
    return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid page id.' }, { status: 400 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ code: 'INVALID_JSON', message: 'Invalid request payload.' }, { status: 400 })
  }

  const parsedPayload = pageUpdateSchema.safeParse(payload)
  if (!parsedPayload.success) {
    return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Please check page details and try again.' }, { status: 400 })
  }

  const auth = await requireAdminUser()
  if (!auth.ok) return auth.response
  const { supabase, userId } = auth

  const pageId = parsedParams.data.id
  const ownsPage = await assertPageOwnership(supabase, pageId, userId)
  if (!ownsPage) return forbidden('You do not have access to this page.')

  const body = parsedPayload.data
  const updatePayload = {
    title: body.title,
    slug: body.slug,
    full_name: body.fullName,
    dob: body.dob,
    dod: body.dod,
    privacy: body.privacy,
    hero_image_url: body.heroImageUrl,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from('pages').update(updatePayload).eq('id', pageId)
  if (error) {
    return databaseError('Unable to update page.')
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
