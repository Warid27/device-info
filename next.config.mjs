/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Future-proof dev origin config
  allowedDevOrigins: [
    'https://examining-contract-habits-your.trycloudflare.com',
    'http://localhost:3000', // add your local dev URL too
  ],
}

export default nextConfig
