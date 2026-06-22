/**
 * Server-only Supabase env vars.
 *
 * The anon key is not a secret in the Supabase model (RLS protects data), but
 * this project only talks to Supabase from the server, so we keep it out of
 * NEXT_PUBLIC_* and avoid shipping it in client bundles.
 *
 * NEVER put SUPABASE_SERVICE_ROLE_KEY in client code or NEXT_PUBLIC_* — that
 * key bypasses RLS.
 */

type SupabaseEnv = {
  url: string
  anonKey: string
}

let cached: SupabaseEnv | null = null

export function getSupabaseEnv(): SupabaseEnv {
  if (cached) return cached

  const url = process.env.SUPABASE_URL?.trim()
  const anonKey = process.env.SUPABASE_ANON_KEY?.trim()

  if (!url || !anonKey) {
    throw new Error(
      'Supabase environment is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in your .env.local file.',
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
