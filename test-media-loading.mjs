// Test the updated media loading logic
import * as blobStorage from './src/lib/vercel-blob-storage.ts';

async function testMediaLoading() {
  try {
    console.log('🧪 Testing updated media loading logic...');
    
    const mediaFiles = await blobStorage.getMediaFiles();
    
    console.log(`✅ Successfully loaded ${mediaFiles.length} media files`);
    
    if (mediaFiles.length > 0) {
      console.log('\n📋 Media files found:');
      mediaFiles.forEach((file, index) => {
        console.log(`${index + 1}. ${file.name}`);
        console.log(`   ID: ${file.id}`);
        console.log(`   URL: ${file.url}`);
        console.log(`   Size: ${file.size}`);
        console.log('');
      });
    } else {
      console.log('⚠️ No media files found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testMediaLoading();