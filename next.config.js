const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Provide a default generateBuildId to work around a Next.js 14 bug
  // where config.generateBuildId being undefined causes a TypeError
  generateBuildId: async () => null,
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: '**.myshopify.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
};

module.exports = nextConfig;
