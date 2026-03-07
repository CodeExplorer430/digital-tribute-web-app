import { createClient } from '@supabase/supabase-js'
import { getSupabasePublishableKeyOrThrow, getSupabaseUrlOrThrow } from '@/lib/supabase/env'

export function createPublicClient() {
  return createClient(getSupabaseUrlOrThrow(), getSupabasePublishableKeyOrThrow(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
