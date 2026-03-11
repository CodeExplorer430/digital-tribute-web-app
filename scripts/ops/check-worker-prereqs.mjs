#!/usr/bin/env node

import { loadLocalEnv } from './load-env.mjs'
import { getTrimmedEnv, isValidAbsoluteUrl } from './env-validation.mjs'

loadLocalEnv()

const issues = []

const supabaseUrl = getTrimmedEnv('WORKER_SUPABASE_URL')
const secretKey = getTrimmedEnv('WORKER_SUPABASE_SECRET_KEY')
const serviceRoleKey = getTrimmedEnv('WORKER_SUPABASE_SERVICE_ROLE_KEY')
const fallbackUrl = getTrimmedEnv('WORKER_FALLBACK_URL')

if (!supabaseUrl) {
  issues.push('WORKER_SUPABASE_URL is required.')
} else if (!isValidAbsoluteUrl(supabaseUrl)) {
  issues.push('WORKER_SUPABASE_URL must be a valid absolute URL.')
}

if (!secretKey && !serviceRoleKey) {
  issues.push(
    'Set one of WORKER_SUPABASE_SECRET_KEY or WORKER_SUPABASE_SERVICE_ROLE_KEY.'
  )
}

if (!fallbackUrl) {
  issues.push('WORKER_FALLBACK_URL is required.')
} else if (!isValidAbsoluteUrl(fallbackUrl)) {
  issues.push('WORKER_FALLBACK_URL must be a valid absolute URL.')
}

console.log('Everlume worker prerequisites check')
console.log('==================================')

if (issues.length > 0) {
  console.log('\nWorker configuration check failed:')
  for (const issue of issues) {
    console.log(`- ${issue}`)
  }
  process.exit(1)
}

console.log('\nWorker configuration check passed.')
