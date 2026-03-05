type Counter = {
  count: number
  resetAt: number
}

const store = new Map<string, Counter>()

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const current = store.get(key)

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt }
  }

  current.count += 1
  store.set(key, current)
  return { allowed: true, remaining: Math.max(limit - current.count, 0), resetAt: current.resetAt }
}

export function getClientIp(forwardedFor: string | null) {
  if (!forwardedFor) return 'unknown'
  return forwardedFor.split(',')[0]?.trim() || 'unknown'
}
