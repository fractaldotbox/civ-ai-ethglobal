/** @type {import('next').NextConfig} */
module.exports = {
  basePath: "/civ-ai-ethglobal",
  // assetPrefix: process.env.NODE_ENV === "production" ? "/civ-ai-ethglobal" : undefined,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // until fix xstate types
    ignoreBuildErrors: true,
  },
  output: 'export',
  reactStrictMode: false,
  transpilePackages: ["@repo/ui"],
};
