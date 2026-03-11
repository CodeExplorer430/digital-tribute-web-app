import { createServiceRoleClient } from '@/lib/supabase/service'
import {
  getVideoTranscodeCallbackTokenOrThrow,
  videoUploadStatusSchema,
} from '@/lib/server/video-upload'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const callbackSchema = z.object({
  jobId: z.string().uuid(),
  status: videoUploadStatusSchema,
  outputPublicId: z.string().trim().min(1).optional(),
  outputUrl: z.string().url().optional(),
  outputBytes: z.number().int().positive().optional(),
  errorMessage: z.string().trim().min(1).max(500).optional(),
})

function isAllowedStatus(status: z.infer<typeof videoUploadStatusSchema>) {
  return (
    status === 'processing' ||
    status === 'completed' ||
    status === 'fallback_required' ||
    status === 'failed'
  )
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || ''
  const expectedToken = getVideoTranscodeCallbackTokenOrThrow()
  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json(
      { code: 'FORBIDDEN', message: 'Invalid callback token.' },
      { status: 403 }
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { code: 'INVALID_JSON', message: 'Invalid callback payload.' },
      { status: 400 }
    )
  }

  const parsed = callbackSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { code: 'VALIDATION_ERROR', message: 'Invalid callback payload.' },
      { status: 400 }
    )
  }

  if (!isAllowedStatus(parsed.data.status)) {
    return NextResponse.json(
      { code: 'INVALID_STATUS', message: 'Callback status is not allowed.' },
      { status: 400 }
    )
  }

  if (parsed.data.status === 'completed' && !parsed.data.outputPublicId) {
    return NextResponse.json(
      {
        code: 'VALIDATION_ERROR',
        message: 'outputPublicId is required for completed jobs.',
      },
      { status: 400 }
    )
  }

  const supabase = createServiceRoleClient()
  const { error } = await supabase
    .from('video_upload_jobs')
    .update({
      status: parsed.data.status,
      output_public_id: parsed.data.outputPublicId ?? null,
      output_url: parsed.data.outputUrl ?? null,
      output_bytes: parsed.data.outputBytes ?? null,
      error_message: parsed.data.errorMessage ?? null,
    })
    .eq('id', parsed.data.jobId)

  if (error) {
    return NextResponse.json(
      { code: 'DATABASE_ERROR', message: 'Unable to update upload job.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
