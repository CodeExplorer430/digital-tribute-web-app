import { assertOwnedRowByPageId, databaseError, forbidden, requireAdminUser } from '@/lib/server/admin-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const paramsSchema = z.object({
  id: z.string().uuid(),
})

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params
  const parsed = paramsSchema.safeParse(params)
  if (!parsed.success) {
    return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid guestbook entry id.' }, { status: 400 })
  }

  const auth = await requireAdminUser()
  if (!auth.ok) return auth.response
  const { supabase, userId } = auth

  const ownsRow = await assertOwnedRowByPageId(supabase, 'guestbook', parsed.data.id, userId)
  if (!ownsRow) return forbidden('You do not have access to this entry.')

  const { error } = await supabase.from('guestbook').delete().eq('id', parsed.data.id)
  if (error) {
    return databaseError('Unable to delete entry.')
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
