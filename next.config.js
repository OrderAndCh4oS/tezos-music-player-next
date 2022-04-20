/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/page/1',
      },
      {
        source: '/playlists',
        destination: '/playlists/1',
      },
    ]
  },
}

module.exports = nextConfig
