'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { hasSupabaseEnv } from '@/lib/supabase/env'

export type ReviewActionResult = { ok: true } | { ok: false; error: string }

async function requireAdmin() {
  if (!hasSupabaseEnv()) {
    return { ok: false as const, error: 'Supabase is not configured.' }
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false as const, error: 'You must be signed in.' }
  }

  const { data: isAdmin } = await supabase.rpc('is_admin')
  if (!isAdmin) {
    return { ok: false as const, error: 'You do not have permission to do that.' }
  }

  return { ok: true as const, supabase }
}

function revalidateReviewPaths() {
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/reviews')
  revalidatePath('/reviews')
}

export async function setReviewPublishedAction(
  reviewId: string,
  published: boolean,
): Promise<ReviewActionResult> {
  const auth = await requireAdmin()
  if (!auth.ok) return auth

  const { error } = await auth.supabase
    .from('reviews')
    .update({ published })
    .eq('id', reviewId)

  if (error) {
    console.error('setReviewPublishedAction', error)
    return { ok: false, error: 'Could not update the review.' }
  }

  revalidateReviewPaths()
  return { ok: true }
}

export async function setReviewFeaturedAction(
  reviewId: string,
  featured: boolean,
): Promise<ReviewActionResult> {
  const auth = await requireAdmin()
  if (!auth.ok) return auth

  const { error } = await auth.supabase
    .from('reviews')
    .update({ featured })
    .eq('id', reviewId)

  if (error) {
    console.error('setReviewFeaturedAction', error)
    return { ok: false, error: 'Could not update the review.' }
  }

  revalidateReviewPaths()
  return { ok: true }
}
