import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for better production performance
  experimental: {
    // Enable optimizations
    optimizePackageImports: ['lucide-react'],
  },
  
  // Build configuration untuk menghindari timeout
  generateBuildId: async () => {
    return 'markasai-build-' + Date.now();
  },
  
  // Static generation configuration
  typescript: {
    // Ignore build errors untuk development/build speed
    ignoreBuildErrors: false,
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
    STORAGE_TYPE: typeof process !== 'undefined' && process.env.NODE_ENV === 'production' ? 'hybrid' : 'file',
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
