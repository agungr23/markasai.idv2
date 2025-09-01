// Direct test of the media API logic
// Set environment variable manually
process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_ZCM8MXIvSYth7ycM_SDuhRCh5wO8k32uqNTUyvmZ6FGQzsu';

// Mock the Next.js environment
global.process = process;

async function testMediaAPI() {
  try {
    console.log('🧪 Testing media API logic directly...');
    
    // Import the blob storage module 
    const blobStorage = require('./src/lib/vercel-blob-storage.ts');
    
    console.log('📋 Calling getMediaFiles()...');
    const mediaFiles = await blobStorage.getMediaFiles();
    
    console.log(`✅ Successfully loaded ${mediaFiles.length} media files`);
    
    if (mediaFiles.length > 0) {
      console.log('\n📁 Media files found:');
      mediaFiles.forEach((file, index) => {
        console.log(`${index + 1}. ${file.name}`);
        console.log(`   ID: ${file.id}`);
        console.log(`   Size: ${file.size}`);
        console.log(`   URL: ${file.url}`);
        console.log('');
      });
      
      console.log('🎉 SUCCESS: The media API is working correctly!');
      console.log('💡 Your CMS should now display these files.');
      
    } else {
      console.log('⚠️ No media files found. This suggests an issue with the blob loading logic.');
    }
    
  } catch (error) {
    console.error('❌ Media API test failed:', error);
    console.error('Stack:', error.stack);
  }
}

testMediaAPI();