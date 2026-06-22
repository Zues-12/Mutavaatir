'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { hasSupabaseEnv } from '@/lib/supabase/env'
import type { LoginState } from './types'

function sanitizeRedirect(next: FormDataEntryValue | null): string {
  if (typeof next !== 'string') return '/admin'
  return next.startsWith('/admin') ? next : '/admin'
}

export async function signInAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!hasSupabaseEnv()) {
    return {
      ok: false,
      error:
        'Supabase is not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY to .env.local and restart the dev server.',
    }
  }

  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const next = sanitizeRedirect(formData.get('next'))

  if (!email || !password) {
    return { ok: false, error: 'Email and password are required.' }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { ok: false, error: error.message }
  }

  // Credentials are good — but is this account allowed in the admin panel?
  // Check `public.is_admin()` and tear down the session if not.
  const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin')
  if (rpcError || !isAdmin) {
    await supabase.auth.signOut()
    return {
      ok: false,
      error: rpcError
        ? 'Could not verify admin access. Try again.'
        : 'This account does not have admin access.',
    }
  }

  redirect(next)
}
