'use client'

/**
 * This project uses Supabase only on the server (see `lib/supabase/server.ts`).
 * A browser client would require NEXT_PUBLIC_* keys in the bundle — avoid unless
 * you truly need client-side Supabase (e.g. realtime subscriptions).
 */
export function createSupabaseBrowserClient(): never {
  throw new Error(
    'Browser Supabase client is disabled. Use server actions or lib/supabase/server.ts instead.',
  )
}
