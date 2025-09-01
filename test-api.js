// Simple test using Next.js API approach
const { loadFromBlob, getMediaFiles } = require('./src/lib/vercel-blob-storage.ts');

async function testAPI() {
  try {
    console.log('🧪 Testing API media loading...');
    
    // Test the direct API call approach
    const response = await fetch('http://localhost:3001/api/media');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', data);
      console.log(`📊 Found ${data.files ? data.files.length : 0} files`);
    } else {
      console.log('❌ API Error:', response.status, response.statusText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    // Fallback: test the blob storage directly
    console.log('\n🔄 Testing blob storage directly...');
    try {
      const files = await getMediaFiles();
      console.log(`✅ Direct call: ${files.length} files found`);
    } catch (directError) {
      console.error('❌ Direct call failed:', directError.message);
    }
  }
}

testAPI();