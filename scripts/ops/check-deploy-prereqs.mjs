#!/usr/bin/env node

import { loadLocalEnv } from './load-env.mjs'
import {
  getTrimmedEnv,
  isPlaceholderVideoTranscodeApiBase,
  isValidAbsoluteUrl,
  normalizeUrl,
} from './env-validation.mjs'

loadLocalEnv()

const requiredAppEnv = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
  'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET',
  'NEXT_PUBLIC_SHORT_DOMAIN',
]

const keyGroups = [
  {
    label: 'Supabase public key',
    keys: [
      'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ],
  },
]

function isProductionCheckEnabled() {
  return (
    process.env.CHECK_PROD_SECURITY === '1' ||
    process.env.DEPLOY_ENV === 'production' ||
    process.env.VERCEL_ENV === 'production'
  )
}

const missing = requiredAppEnv.filter((key) => !getTrimmedEnv(key))
const missingGroups = keyGroups.filter((group) =>
  group.keys.every((key) => !getTrimmedEnv(key))
)
const strictProdCheck = isProductionCheckEnabled()

const securityIssues = []
if (strictProdCheck) {
  if (process.env.RATE_LIMIT_BACKEND !== 'upstash') {
    securityIssues.push(
      'RATE_LIMIT_BACKEND must be set to "upstash" for production.'
    )
  }
  if (
    !getTrimmedEnv('UPSTASH_REDIS_REST_URL') ||
    !getTrimmedEnv('UPSTASH_REDIS_REST_TOKEN')
  ) {
    securityIssues.push(
      'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required for production.'
    )
  }
  if (process.env.CAPTCHA_ENABLED !== '1') {
    securityIssues.push('CAPTCHA_ENABLED must be set to "1" for production.')
  }
  if (!getTrimmedEnv('CAPTCHA_SECRET')) {
    securityIssues.push('CAPTCHA_SECRET is required for production.')
  }
  if (!getTrimmedEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY')) {
    securityIssues.push(
      'NEXT_PUBLIC_TURNSTILE_SITE_KEY is required for production.'
    )
  }
  const transcodeApiBase = getTrimmedEnv('VIDEO_TRANSCODE_API_BASE')
  const transcodeAppBase = getTrimmedEnv('VIDEO_TRANSCODE_APP_BASE')

  if (!transcodeApiBase) {
    securityIssues.push('VIDEO_TRANSCODE_API_BASE is required for production.')
  } else if (!isValidAbsoluteUrl(transcodeApiBase)) {
    securityIssues.push(
      'VIDEO_TRANSCODE_API_BASE must be a valid absolute URL.'
    )
  } else if (isPlaceholderVideoTranscodeApiBase(transcodeApiBase)) {
    securityIssues.push(
      'VIDEO_TRANSCODE_API_BASE must point to a real transcode service, not a placeholder URL.'
    )
  }
  if (!getTrimmedEnv('VIDEO_TRANSCODE_API_TOKEN')) {
    securityIssues.push('VIDEO_TRANSCODE_API_TOKEN is required for production.')
  }
  if (!getTrimmedEnv('VIDEO_TRANSCODE_CALLBACK_TOKEN')) {
    securityIssues.push(
      'VIDEO_TRANSCODE_CALLBACK_TOKEN is required for production.'
    )
  }
  if (!transcodeAppBase) {
    securityIssues.push('VIDEO_TRANSCODE_APP_BASE is required for production.')
  } else if (!isValidAbsoluteUrl(transcodeAppBase)) {
    securityIssues.push(
      'VIDEO_TRANSCODE_APP_BASE must be a valid absolute URL.'
    )
  }

  const publicAppUrl = getTrimmedEnv('NEXT_PUBLIC_APP_URL')
  if (publicAppUrl && transcodeAppBase) {
    const normalizedPublicAppUrl = normalizeUrl(publicAppUrl)
    const normalizedTranscodeAppBase = normalizeUrl(transcodeAppBase)
    if (!normalizedPublicAppUrl) {
      securityIssues.push(
        'NEXT_PUBLIC_APP_URL must be a valid absolute URL when set.'
      )
    } else if (normalizedPublicAppUrl !== normalizedTranscodeAppBase) {
      securityIssues.push(
        'VIDEO_TRANSCODE_APP_BASE must match NEXT_PUBLIC_APP_URL in production.'
      )
    }
  }
}

console.log('Everlume pre-deploy prerequisites check')
console.log('=====================================')

if (missing.length > 0 || missingGroups.length > 0) {
  console.log('\nMissing app environment variables:')
  for (const key of missing) {
    console.log(`- ${key}`)
  }
  for (const group of missingGroups) {
    console.log(`- ${group.label}: set one of [${group.keys.join(', ')}]`)
  }

  console.log(
    '\nSet them in `.env.local` for local runs and in Vercel/GitHub as needed.'
  )
  console.log('Cloudflare Worker secrets to set separately:')
  console.log('- SUPABASE_URL')
  console.log('- SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY)')
  console.log('- FALLBACK_URL')
  process.exit(1)
}

if (securityIssues.length > 0) {
  console.log('\nProduction security gate failed:')
  for (const issue of securityIssues) {
    console.log(`- ${issue}`)
  }
  console.log('\nSet required values before any production deployment.')
  process.exit(1)
}

console.log('\nAll required app environment variables are set.')
if (strictProdCheck) {
  console.log('Production security gate passed.')
}
console.log(
  '\nReminder: Worker secrets are managed in Cloudflare dashboard or Wrangler.'
)
process.exit(0)
