const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    webpackBuildWorker: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components': path.resolve(__dirname, 'components'),
      '@/lib': path.resolve(__dirname, 'lib'),
      '@/hooks': path.resolve(__dirname, 'hooks'),
    };
    return config;
  },
};

module.exports = nextConfig;
