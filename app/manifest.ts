import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.defaultTitle,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0d0d0d',
    theme_color: '#0d0d0d',
    lang: 'en-PK',
    icons: [
      {
        src: siteConfig.logoPath,
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-dark-32x32.webp',
        sizes: '32x32',
        type: 'image/webp',
      },
      {
        src: '/apple-icon.webp',
        sizes: '180x180',
        type: 'image/webp',
        purpose: 'any',
      },
    ],
  }
}
