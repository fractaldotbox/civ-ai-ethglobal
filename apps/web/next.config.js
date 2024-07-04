/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // until fix xstate types
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  transpilePackages: ["@repo/ui"],
};
