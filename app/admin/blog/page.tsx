import type { Metadata } from 'next'
import Link from 'next/link'
import { PenLine } from 'lucide-react'
import BlogPostsTable from '@/components/admin/blog-posts-table'
import { listBlogPosts } from '@/lib/admin/blog-queries'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Manage blog posts for Mutavaatir.',
  robots: { index: false, follow: false },
}

export default async function AdminBlogPage() {
  const posts = await listBlogPosts()

  const published = posts.filter((p) => p.status === 'published').length
  const drafts = posts.filter((p) => p.status === 'draft').length

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-normal uppercase tracking-wider text-brand-mist">
            Blog
          </h1>
          <p className="mt-1 text-xs text-brand-earth">
            {posts.length} post{posts.length !== 1 ? 's' : ''} ·{' '}
            <span className="text-emerald-400">{published} published</span>
            {drafts > 0 && (
              <span className="text-brand-earth"> · {drafts} draft{drafts !== 1 ? 's' : ''}</span>
            )}
          </p>
        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 border border-brand-clay bg-brand-clay/15 px-4 py-2 text-xs uppercase tracking-wider text-brand-clay transition-colors hover:bg-brand-clay/25 hover:text-brand-mist self-start"
        >
          <PenLine className="h-3.5 w-3.5" />
          New Post
        </Link>
      </div>

      {/* Table */}
      <div className="border border-brand-earth/30 bg-brand-void">
        <BlogPostsTable posts={posts} />
      </div>
    </div>
  )
}
