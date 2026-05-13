'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { hasSupabaseEnv } from '@/lib/supabase/env'

export async function signOutAction() {
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
  }
  redirect('/admin-login')
}
