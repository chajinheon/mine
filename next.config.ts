import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  // Turbopack 사용 (Next.js 16 기본)
  turbopack: {},
};

export default nextConfig;
