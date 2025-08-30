import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for better production performance
  experimental: {
    // Enable optimizations
    optimizePackageImports: ['lucide-react'],
  },
  
  // Ensure proper image optimization
  images: {
    domains: [],
    unoptimized: false,
  },
  
  // Output configuration for better compatibility
  output: undefined, // Let Next.js decide based on deployment target
  
  // Enable compression
  compress: true,
  
  // Optimize CSS
  optimizeFonts: true,
  
  // Environment-specific configurations
  env: {
    STORAGE_TYPE: process.env.NODE_ENV === 'production' ? 'hybrid' : 'file',
  },
  
  // Headers for better performance
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
