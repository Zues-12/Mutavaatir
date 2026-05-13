'use client'

import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseEnv } from './env'

/**
 * Browser Supabase client. Use in client components for auth state and
 * client-side queries. Server components / route handlers should use the
 * server client from `./server`.
 */
export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseEnv()
  return createBrowserClient(url, anonKey)
}
