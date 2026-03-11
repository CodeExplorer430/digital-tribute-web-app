import { z } from 'zod'

export const videoUploadStatusSchema = z.enum([
  'queued',
  'uploading',
  'processing',
  'completed',
  'fallback_required',
  'failed',
  'attached',
])

export type VideoUploadStatus = z.infer<typeof videoUploadStatusSchema>

function normalizeTranscodeApiBase(value?: string) {
  if (!value || value.trim() === '') return null
  return value.replace(/\/+$/, '')
}

export function isPlaceholderVideoTranscodeApiBase(value?: string) {
  if (!value) return false
  try {
    const url = new URL(value)
    return (
      url.hostname === 'your-cloud-run-service.run.app' ||
      url.hostname === 'example.com'
    )
  } catch {
    return false
  }
}

export function getVideoTranscodeApiBaseOrThrow() {
  const value = normalizeTranscodeApiBase(process.env.VIDEO_TRANSCODE_API_BASE)
  if (value && !isPlaceholderVideoTranscodeApiBase(value)) return value
  throw new Error('[video:transcode-api] Missing VIDEO_TRANSCODE_API_BASE')
}

export function getVideoTranscodeApiTokenOrThrow() {
  const value = process.env.VIDEO_TRANSCODE_API_TOKEN
  if (value && value.trim() !== '') return value
  throw new Error('[video:transcode-api] Missing VIDEO_TRANSCODE_API_TOKEN')
}

export function getVideoTranscodeCallbackTokenOrThrow() {
  const value = process.env.VIDEO_TRANSCODE_CALLBACK_TOKEN
  if (value && value.trim() !== '') return value
  throw new Error(
    '[video:transcode-callback] Missing VIDEO_TRANSCODE_CALLBACK_TOKEN'
  )
}

export function isVideoTranscodeConfigured() {
  const base = normalizeTranscodeApiBase(process.env.VIDEO_TRANSCODE_API_BASE)
  return Boolean(
    base &&
    !isPlaceholderVideoTranscodeApiBase(base) &&
    process.env.VIDEO_TRANSCODE_API_TOKEN &&
    process.env.VIDEO_TRANSCODE_CALLBACK_TOKEN
  )
}
