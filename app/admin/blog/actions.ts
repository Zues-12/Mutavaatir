'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { BlogPostStatus } from '@/lib/admin/blog-queries'

export type ActionResult = { ok: true } | { ok: false; error: string }
export type ActionResultWithId = { ok: true; id: string } | { ok: false; error: string }

async function getAdminClient() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { supabase, user: null, isAdmin: false }

  const { data: isAdmin } = await supabase.rpc('is_admin')
  return { supabase, user, isAdmin: Boolean(isAdmin) }
}

function revalidateBlogPaths(post?: {
  id?: string
  slug?: string | null
  previousSlug?: string | null
}) {
  revalidatePath('/admin/blog')
  revalidatePath('/blog')

  if (post?.id) revalidatePath(`/admin/blog/${post.id}/edit`)

  const publicSlugs = new Set([post?.slug, post?.previousSlug].filter(Boolean))
  for (const slug of publicSlugs) {
    revalidatePath(`/blog/${slug}`)
  }
}

export type BlogPostInput = {
  title: string
  slug: string
  subtitle?: string
  excerpt?: string
  content?: string
  cover_image_url?: string
  cover_image_alt?: string
  author_name: string
  author_bio?: string
  author_avatar_url?: string
  author_twitter?: string
  author_instagram?: string
  author_website?: string
  categories: string[]
  tags: string[]
  language: string
  status: BlogPostStatus
  featured: boolean
  seo_title?: string
  seo_description?: string
  publish_date?: string
}

function sanitize(value: string | undefined): string | null {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export async function createBlogPostAction(
  input: BlogPostInput,
): Promise<ActionResultWithId> {
  const { supabase, user, isAdmin } = await getAdminClient()
  if (!isAdmin || !user) {
    return { ok: false, error: 'You must be signed in as an admin.' }
  }

  if (!input.title?.trim()) return { ok: false, error: 'Title is required.' }
  if (!input.slug?.trim()) return { ok: false, error: 'Slug is required.' }
  if (!input.author_name?.trim()) return { ok: false, error: 'Author name is required.' }

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      title: input.title.trim(),
      slug: input.slug.trim(),
      subtitle: sanitize(input.subtitle),
      excerpt: sanitize(input.excerpt),
      content: input.content ?? null,
      cover_image_url: sanitize(input.cover_image_url),
      cover_image_alt: sanitize(input.cover_image_alt),
      author_name: input.author_name.trim(),
      author_bio: sanitize(input.author_bio),
      author_avatar_url: sanitize(input.author_avatar_url),
      author_twitter: sanitize(input.author_twitter),
      author_instagram: sanitize(input.author_instagram),
      author_website: sanitize(input.author_website),
      categories: input.categories,
      tags: input.tags,
      language: input.language || 'en',
      status: input.status,
      featured: input.featured,
      seo_title: sanitize(input.seo_title),
      seo_description: sanitize(input.seo_description),
      publish_date: input.publish_date || null,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (error) {
    console.error('createBlogPostAction', error)
    if (error.code === '23505') return { ok: false, error: 'A post with this slug already exists.' }
    return { ok: false, error: 'Could not create blog post.' }
  }

  revalidateBlogPaths({ id: data.id, slug: input.slug.trim() })
  return { ok: true, id: data.id }
}

export async function updateBlogPostAction(
  id: string,
  input: BlogPostInput,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: 'Missing post id.' }

  const { supabase, isAdmin } = await getAdminClient()
  if (!isAdmin) {
    return { ok: false, error: 'You must be signed in as an admin.' }
  }

  if (!input.title?.trim()) return { ok: false, error: 'Title is required.' }
  if (!input.slug?.trim()) return { ok: false, error: 'Slug is required.' }
  if (!input.author_name?.trim()) return { ok: false, error: 'Author name is required.' }

  const { data: existingPost } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase
    .from('blog_posts')
    .update({
      title: input.title.trim(),
      slug: input.slug.trim(),
      subtitle: sanitize(input.subtitle),
      excerpt: sanitize(input.excerpt),
      content: input.content ?? null,
      cover_image_url: sanitize(input.cover_image_url),
      cover_image_alt: sanitize(input.cover_image_alt),
      author_name: input.author_name.trim(),
      author_bio: sanitize(input.author_bio),
      author_avatar_url: sanitize(input.author_avatar_url),
      author_twitter: sanitize(input.author_twitter),
      author_instagram: sanitize(input.author_instagram),
      author_website: sanitize(input.author_website),
      categories: input.categories,
      tags: input.tags,
      language: input.language || 'en',
      status: input.status,
      featured: input.featured,
      seo_title: sanitize(input.seo_title),
      seo_description: sanitize(input.seo_description),
      publish_date: input.publish_date || null,
    })
    .eq('id', id)

  if (error) {
    console.error('updateBlogPostAction', error)
    if (error.code === '23505') return { ok: false, error: 'A post with this slug already exists.' }
    return { ok: false, error: 'Could not update blog post.' }
  }

  revalidateBlogPaths({
    id,
    slug: input.slug.trim(),
    previousSlug: existingPost?.slug ?? null,
  })
  return { ok: true }
}

export async function deleteBlogPostAction(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: 'Missing post id.' }

  const { supabase, isAdmin } = await getAdminClient()
  if (!isAdmin) {
    return { ok: false, error: 'You must be signed in as an admin.' }
  }

  const { data: existingPost } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase.from('blog_posts').delete().eq('id', id)

  if (error) {
    console.error('deleteBlogPostAction', error)
    return { ok: false, error: 'Could not delete blog post.' }
  }

  revalidateBlogPaths({ id, slug: existingPost?.slug ?? null })
  redirect('/admin/blog')
}

export async function uploadBlogImageAction(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const { supabase, isAdmin } = await getAdminClient()
  if (!isAdmin) return { ok: false, error: 'Not authorized.' }

  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { ok: false, error: 'No file provided.' }

  if (file.size > 10 * 1024 * 1024) {
    return { ok: false, error: 'Image must be under 10 MB.' }
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `posts/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from('blog-images')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) {
    console.error('uploadBlogImageAction', error)
    return { ok: false, error: 'Image upload failed.' }
  }

  const { data } = supabase.storage.from('blog-images').getPublicUrl(path)
  return { ok: true, url: data.publicUrl }
}
