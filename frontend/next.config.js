/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/users/:path*',
        destination: 'http://localhost:8000/api/users/:path*',
      },
      {
        source: '/api/conversations/:path*',
        destination: 'http://localhost:8000/api/conversations/:path*',
      }
    ]
  },
  experimental: {
    // Allow absolute imports from the project root
    externalDir: true,
  }
}

module.exports = nextConfig