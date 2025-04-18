/*
<ai_context>
Configures Next.js for the app.
</ai_context>
*/

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  },
  // Explicitly exclude reference files and ignore build-time checks
  eslint: {
    ignoreDuringBuilds: true,
    dirs: [
      'app',
      'components',
      'lib',
      'hooks',
      'actions',
      'types'
    ]
  },
  typescript: {
    ignoreBuildErrors: true
  },
  // Exclude _reference directory from compilation
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  webpack: (config, { dev, isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/_reference/**']
    }
    return config
  }
}

export default config
