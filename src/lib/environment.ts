// Environment detector and configuration helper
// Safe for Edge Runtime with proper type casting
export function getEnvironmentInfo() {
  // Safe check for process object using type casting
  const hasProcess = (() => {
    try {
      return (
        typeof globalThis !== 'undefined' && 
        'process' in globalThis &&
        typeof (globalThis as any).process !== 'undefined'
      );
    } catch {
      return false;
    }
  })();
  
  const isProduction = hasProcess ? (globalThis as any).process.env.NODE_ENV === 'production' : false;
  const isVercel = hasProcess ? (globalThis as any).process.env.VERCEL === '1' : false;
  const isNetlify = hasProcess ? (globalThis as any).process.env.NETLIFY === 'true' : false;
  const isServer = typeof window === 'undefined';
  
  // Runtime detection with fallback
  let runtime = 'nodejs';
  if (hasProcess) {
    runtime = (globalThis as any).process.env.NEXT_RUNTIME || 'nodejs';
  } else if (typeof globalThis !== 'undefined' && 'EdgeRuntime' in globalThis) {
    runtime = 'edge';
  }
  
  return {
    isProduction,
    isVercel,
    isNetlify,
    isServer,
    isServerless: isVercel || isNetlify,
    runtime,
    hasProcess
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