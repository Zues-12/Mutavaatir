import Link from 'next/link'
import { format } from 'date-fns'
import { Pencil, Star, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BlogPostListItem } from '@/lib/admin/blog-queries'

function StatusBadge({ status }: { status: 'draft' | 'published' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-wider',
        status === 'published'
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
          : 'border-brand-earth/40 bg-brand-earth/10 text-brand-earth',
      )}
    >
      {status}
    </span>
  )
}

type BlogPostsTableProps = {
  posts: readonly BlogPostListItem[]
}

export default function BlogPostsTable({ posts }: BlogPostsTableProps) {
  if (posts.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-sm text-brand-dust">No blog posts yet.</p>
        <p className="mt-1 text-xs text-brand-earth">Create your first post to get started.</p>
      </div>
    )
  }

  return (
    <div className="scrollbar-brand overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-brand-earth/40 text-[0.65rem] uppercase tracking-[0.2em] text-brand-earth">
            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Title
            </th>
            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Author
            </th>
            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Categories
            </th>
            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Language
            </th>
            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Status
            </th>
            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Featured
            </th>
            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Date
            </th>
            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-earth/20">
          {posts.map((post) => (
            <tr
              key={post.id}
              className="align-top transition-colors duration-150 hover:bg-brand-earth/10"
            >
              <td className="px-5 py-4 sm:px-6">
                <p className="font-medium text-brand-mist leading-snug">{post.title}</p>
                <p className="mt-0.5 font-mono text-[0.65rem] text-brand-earth/70">{post.slug}</p>
              </td>
              <td className="px-5 py-4 text-brand-dust sm:px-6">{post.author_name || '—'}</td>
              <td className="px-5 py-4 sm:px-6">
                {post.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {post.categories.map((c) => (
                      <span
                        key={c}
                        className="border border-brand-earth/30 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wider text-brand-earth"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-brand-earth/40">—</span>
                )}
              </td>
              <td className="px-5 py-4 sm:px-6">
                <div className="flex items-center gap-1.5 text-xs text-brand-earth">
                  <Globe className="h-3 w-3 shrink-0" aria-hidden />
                  {post.language.toUpperCase()}
                </div>
              </td>
              <td className="px-5 py-4 sm:px-6">
                <StatusBadge status={post.status} />
              </td>
              <td className="px-5 py-4 sm:px-6">
                {post.featured ? (
                  <div className="flex items-center gap-1.5 text-xs text-brand-clay">
                    <Star className="h-3.5 w-3.5 fill-brand-clay" aria-hidden />
                    Featured
                  </div>
                ) : (
                  <span className="text-xs text-brand-earth/40">—</span>
                )}
              </td>
              <td className="px-5 py-4 text-xs text-brand-earth sm:px-6">
                <time
                  dateTime={post.publish_date ?? post.created_at}
                  title={`Created ${format(new Date(post.created_at), 'PPP')}`}
                >
                  {format(new Date(post.publish_date ?? post.created_at), 'MMM d, yyyy')}
                </time>
              </td>
              <td className="px-5 py-4 sm:px-6">
                <Link
                  href={`/admin/blog/${post.id}/edit`}
                  className="inline-flex items-center gap-1.5 border border-brand-earth/30 px-3 py-1.5 text-xs text-brand-dust transition-colors hover:border-brand-clay hover:text-brand-clay"
                >
                  <Pencil className="h-3 w-3" aria-hidden />
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
