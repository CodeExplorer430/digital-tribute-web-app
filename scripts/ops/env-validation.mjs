export function getTrimmedEnv(name) {
  const value = process.env[name]
  if (!value) return null
  const trimmed = `${value}`.trim()
  return trimmed === '' ? null : trimmed
}

export function isPlaceholderVideoTranscodeApiBase(value) {
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

export function isValidAbsoluteUrl(value) {
  if (!value) return false
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function normalizeUrl(value) {
  if (!isValidAbsoluteUrl(value)) return null
  return value.replace(/\/+$/, '')
}
