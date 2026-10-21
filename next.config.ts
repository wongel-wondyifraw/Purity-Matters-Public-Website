import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    cpus: 1,
  },
  turbopack: {},
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
