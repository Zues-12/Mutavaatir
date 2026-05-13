import type { NextRequest } from 'next/server'
import { updateAdminSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  return updateAdminSession(request)
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/admin-login'],
}
