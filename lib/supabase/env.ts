/**
 * Reads and validates Supabase env vars used by the admin panel.
 * Throwing here at call time gives clearer errors than crashing
 * inside @supabase/ssr deep in the request lifecycle.
 */

type SupabaseEnv = {
  url: string
  anonKey: string
}

let cached: SupabaseEnv | null = null

export function getSupabaseEnv(): SupabaseEnv {
  if (cached) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!url || !anonKey) {
    throw new Error(
      'Supabase environment is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.',
    )
  }

  cached = { url, anonKey }
  return cached
}

export function hasSupabaseEnv(): boolean {
  try {
    getSupabaseEnv()
    return true
  } catch {
    return false
  }
}
