import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const host = getSiteUrl()
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin-login', '/reviews/submit'],
    },
    sitemap: `${host}/sitemap.xml`,
    host,
  }
}
