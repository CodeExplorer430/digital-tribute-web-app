import {
  getSupabasePublishableKeyOrThrow,
  getSupabaseSecretKeyOrThrow,
  getSupabaseUrlOrThrow,
} from '@/lib/supabase/env'

describe('supabase env helpers', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env = { ...originalEnv }
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    delete process.env.SUPABASE_SECRET_KEY
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('reads required url from NEXT_PUBLIC_SUPABASE_URL', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    expect(getSupabaseUrlOrThrow()).toBe('https://example.supabase.co')
  })

  it('throws when url is missing', () => {
    expect(() => getSupabaseUrlOrThrow()).toThrow('[supabase:url]')
  })

  it('prefers publishable key over anon key', () => {
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'pk-key'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
    expect(getSupabasePublishableKeyOrThrow()).toBe('pk-key')
  })

  it('falls back to anon key when publishable key is missing', () => {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
    expect(getSupabasePublishableKeyOrThrow()).toBe('anon-key')
  })

  it('throws when publishable and anon keys are both missing', () => {
    expect(() => getSupabasePublishableKeyOrThrow()).toThrow(
      '[supabase:publishable-key]'
    )
  })

  it('prefers SUPABASE_SECRET_KEY over SUPABASE_SERVICE_ROLE_KEY', () => {
    process.env.SUPABASE_SECRET_KEY = 'secret-key'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'legacy-secret'
    expect(getSupabaseSecretKeyOrThrow()).toBe('secret-key')
  })

  it('falls back to legacy service role key', () => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'legacy-secret'
    expect(getSupabaseSecretKeyOrThrow()).toBe('legacy-secret')
  })

  it('throws when no secret keys are present', () => {
    expect(() => getSupabaseSecretKeyOrThrow()).toThrow('[supabase:secret-key]')
  })
})
