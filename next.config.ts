import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/project-barber',
  assetPrefix: '/project-barber/',
  images: { unoptimized: true },
  experimental: {
    cpus: 1,
  },
};

export default nextConfig;