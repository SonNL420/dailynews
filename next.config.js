/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // rss-parser (and its xml2js dependency) are CommonJS and should run on the
  // Node.js server runtime rather than being bundled for the edge.
  serverExternalPackages: ['rss-parser'],
  // ESLint is intentionally not configured for this project; skip it during builds.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
