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
    'http://localhost:3000', 
    'https://couples-illustrated-portion-timothy.trycloudflare.com'
  ],
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Accept-CH', value: 'Sec-CH-UA, Sec-CH-UA-Model, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Full-Version-List' },
          { key: 'Permissions-Policy', value: 'ch-ua=(self), ch-ua-model=(self), ch-ua-platform=(self), ch-ua-platform-version=(self), ch-ua-full-version-list=(self)' },
        ],
      },
    ]
  },
}

export default nextConfig
