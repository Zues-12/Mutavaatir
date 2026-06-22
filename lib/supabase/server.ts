import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { getSupabaseEnv } from './env'

const noopCookies = {
  getAll() {
    return []
  },
  setAll() {},
}

/**
 * Server-side Supabase client for Next.js App Router. Reads and writes
 * auth cookies via the Next cookie store so server components, server
 * actions and route handlers stay in sync with the session.
 *
 * In Next 16 `cookies()` is async, so this helper is async too.
 */
export async function createSupabaseServerClient() {
  const { url, anonKey } = getSupabaseEnv()
  const cookieStore = await cookies()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // setAll can be called from a Server Component where cookies are
          // read-only. Middleware will refresh the session on the next
          // request, so swallowing this is safe.
        }
      },
    },
  })
}

/** Anonymous client for public pages — ignores admin session cookies. */
export function createSupabasePublicClient() {
  const { url, anonKey } = getSupabaseEnv()

  return createServerClient(url, anonKey, {
    cookies: noopCookies,
  })
}
