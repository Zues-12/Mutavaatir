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
  },
}

export default nextConfig
