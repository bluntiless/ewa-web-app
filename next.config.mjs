/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/candidate-check',
        destination: '/eligibility',
        permanent: true, // 301 redirect - tells Google the page has permanently moved
      },
    ]
  },
}

export default nextConfig
