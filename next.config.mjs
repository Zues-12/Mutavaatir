/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  reactStrictMode: true,
  /** Serve originals from /public — no recompression or format conversion. */
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    viewTransition: true,
    serverActions: {
      /** subscribe/actions.ts allows 5 MB screenshots; limit includes other form fields */
      bodySizeLimit: '6mb',
    },
  },
}

export default nextConfig
