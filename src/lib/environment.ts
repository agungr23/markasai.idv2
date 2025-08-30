// Environment detector and configuration helper
export function getEnvironmentInfo() {
  const isProduction = process.env.NODE_ENV === 'production';
  const isVercel = process.env.VERCEL === '1';
  const isNetlify = process.env.NETLIFY === 'true';
  const isServer = typeof window === 'undefined';
  
  return {
    isProduction,
    isVercel,
    isNetlify,
    isServer,
    isServerless: isVercel || isNetlify,
    runtime: process.env.NEXT_RUNTIME || 'nodejs'
  };
}

export function getStorageConfig() {
  const env = getEnvironmentInfo();
  
  if (env.isServerless) {
    return {
      type: 'memory',
      persistent: false,
      description: 'In-memory storage for serverless environments'
    };
  }
  
  if (env.isProduction) {
    return {
      type: 'hybrid',
      persistent: true,
      description: 'Hybrid storage with file system fallback'
    };
  }
  
  return {
    type: 'file',
    persistent: true,
    description: 'File system storage for development'
  };
}

// Debug storage information
export function logStorageInfo() {
  const env = getEnvironmentInfo();
  const config = getStorageConfig();
  
  console.log('🔧 Storage Configuration:');
  console.log(`   Environment: ${env.isProduction ? 'Production' : 'Development'}`);
  console.log(`   Platform: ${env.isVercel ? 'Vercel' : env.isNetlify ? 'Netlify' : 'Self-hosted'}`);
  console.log(`   Runtime: ${env.runtime}`);
  console.log(`   Storage Type: ${config.type}`);
  console.log(`   Persistent: ${config.persistent}`);
  console.log(`   Description: ${config.description}`);
}