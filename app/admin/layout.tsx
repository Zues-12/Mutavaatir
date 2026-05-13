import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/admin-shell'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { hasSupabaseEnv } from '@/lib/supabase/env'

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Mutavaatir admin panel.',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Middleware already guards this route, but we re-check here so the
  // server-rendered shell only ever runs for an authenticated user.
  if (!hasSupabaseEnv()) {
    redirect('/admin-login')
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin-login')
  }

  // Defense in depth: the edge proxy already gates this, but if the RPC
  // says no (or errors), don't render the shell.
  const { data: isAdmin } = await supabase.rpc('is_admin')
  if (!isAdmin) {
    redirect('/admin-login?error=not-admin')
  }

  return <AdminShell userEmail={user.email ?? null}>{children}</AdminShell>
}
