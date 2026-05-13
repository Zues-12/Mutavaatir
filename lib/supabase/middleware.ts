import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getSupabaseEnv, hasSupabaseEnv } from './env'

const LOGIN_PATH = '/admin-login'
const ADMIN_PATH = '/admin'

/**
 * Refreshes the Supabase session and guards admin routes.
 *
 * Auth rules:
 * - Anonymous visitors to `/admin` → bounced to `/admin-login?next=...`.
 * - Signed-in visitors to `/admin` who are NOT in `public.admins` → bounced
 *   to `/admin-login?error=not-admin` (e.g. an admin got demoted mid-session).
 * - Signed-in admins on `/admin-login` → bounced to `/admin` (or `next`).
 * - Signed-in non-admins on `/admin-login` → left alone, so they can sign in
 *   again as a different (admin) user without redirect loops.
 *
 * When Supabase env vars are missing we let the request through so the
 * marketing site keeps working; admin pages handle the missing-config
 * case themselves.
 */
export async function updateAdminSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  if (!hasSupabaseEnv()) return response

  const { url, anonKey } = getSupabaseEnv()

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value)
        }
        response = NextResponse.next({ request })
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options)
        }
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname, search } = request.nextUrl
  const isAdminRoute =
    pathname === ADMIN_PATH || pathname.startsWith(`${ADMIN_PATH}/`)
  const isLoginRoute = pathname === LOGIN_PATH

  if (!user) {
    if (isAdminRoute) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = LOGIN_PATH
      redirectUrl.search = ''
      redirectUrl.searchParams.set('next', `${pathname}${search}`)
      return NextResponse.redirect(redirectUrl)
    }
    return response
  }

  // Signed in — check admin status via the SECURITY DEFINER helper.
  // If the RPC fails (e.g. migration not applied) we fail closed.
  const { data: isAdmin } = await supabase.rpc('is_admin')

  if (isAdminRoute && !isAdmin) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = LOGIN_PATH
    redirectUrl.search = ''
    redirectUrl.searchParams.set('error', 'not-admin')
    return NextResponse.redirect(redirectUrl)
  }

  if (isLoginRoute && isAdmin) {
    const redirectUrl = request.nextUrl.clone()
    const next = request.nextUrl.searchParams.get('next')
    redirectUrl.pathname = next && next.startsWith('/admin') ? next : ADMIN_PATH
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
  }

  return response
}
