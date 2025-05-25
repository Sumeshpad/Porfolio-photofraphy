/** @type {import('next').NextConfig} */
const nextConfig = {
  // remove export
  reactStrictMode: true,
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig;
