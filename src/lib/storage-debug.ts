// Storage health check and debugging utilities
// Safe for Edge Runtime
import { getStorageAdapter } from './storage-adapter';
import { getEnvironmentInfo } from './environment';

export interface StorageHealthStatus {
  working: boolean;
  type: string;
  canRead: boolean;
  canWrite: boolean;
  error?: string;
  environment: any;
}

export async function checkStorageHealth(): Promise<StorageHealthStatus> {
  const storage = await getStorageAdapter();
  const env = getEnvironmentInfo();
  
  try {
    // Test write operation
    const testData = { test: 'health-check', timestamp: Date.now() };
    await storage.write('health-check', testData);
    
    // Test read operation
    const readData = await storage.read('health-check', null);
    
    const canWrite = true;
    const canRead = readData && readData.test === 'health-check';
    
    return {
      working: canRead && canWrite,
      type: storage.constructor.name,
      canRead,
      canWrite,
      environment: env
    };
  } catch (error) {
    return {
      working: false,
      type: storage.constructor.name,
      canRead: false,
      canWrite: false,
      error: error instanceof Error ? error.message : String(error),
      environment: env
    };
  }
}

export async function debugStorageInfo() {
  console.log('🔍 Debugging Storage Information...');
  
  const health = await checkStorageHealth();
  
  console.log('📊 Storage Health Check:');
  console.log(`   Status: ${health.working ? '✅ Working' : '❌ Failed'}`);
  console.log(`   Type: ${health.type}`);
  console.log(`   Can Read: ${health.canRead ? '✅' : '❌'}`);
  console.log(`   Can Write: ${health.canWrite ? '✅' : '❌'}`);
  
  if (health.error) {
    console.log(`   Error: ${health.error}`);
  }
  
  console.log('\n🌍 Environment Info:');
  console.log(`   Production: ${health.environment.isProduction}`);
  console.log(`   Serverless: ${health.environment.isServerless}`);
  console.log(`   Runtime: ${health.environment.runtime}`);
  
  return health;
}

// Test all storage modules
export async function testAllStorageModules() {
  console.log('🧪 Testing all storage modules...');
  
  try {
    // Test settings
    const { getSettingsFromStorage } = await import('./settings-storage-edge');
    const settings = await getSettingsFromStorage();
    console.log('✅ Settings storage: OK');
    
    // Test products
    const { getProductsFromStorage } = await import('./product-storage');
    const products = await getProductsFromStorage();
    console.log('✅ Products storage: OK');
    
    // Test testimonials
    const { getTestimonialsFromStorage } = await import('./testimonial-storage');
    const testimonials = await getTestimonialsFromStorage();
    console.log('✅ Testimonials storage: OK');
    
    // Test blog posts
    const { getBlogPostsFromStorage } = await import('./blog-storage');
    const blogPosts = await getBlogPostsFromStorage();
    console.log('✅ Blog posts storage: OK');
    
    // Test case studies
    const { getCaseStudiesFromStorage } = await import('./case-study-storage');
    const caseStudies = await getCaseStudiesFromStorage();
    console.log('✅ Case studies storage: OK');
    
    return {
      success: true,
      modules: {
        settings: !!settings,
        products: Array.isArray(products),
        testimonials: Array.isArray(testimonials),
        blogPosts: Array.isArray(blogPosts),
        caseStudies: Array.isArray(caseStudies)
      }
    };
  } catch (error) {
    console.error('❌ Storage module test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}