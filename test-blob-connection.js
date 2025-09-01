// Test Blob storage connection and list all files
const { list } = require('@vercel/blob');

async function testBlobConnection() {
  try {
    console.log('🔑 Checking BLOB_READ_WRITE_TOKEN...');
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error('❌ BLOB_READ_WRITE_TOKEN not found in environment');
      return;
    }
    console.log('✅ Token found:', token.substring(0, 20) + '...');

    console.log('\n📋 Listing all blobs...');
    const result = await list();
    console.log('📊 Total blobs found:', result.blobs.length);
    
    console.log('\n📁 All files in Blob storage:');
    result.blobs.forEach((blob, index) => {
      console.log(`${index + 1}. ${blob.pathname}`);
      console.log(`   URL: ${blob.url}`);
    });

    console.log('\n🔍 Looking for media-related files:');
    const mediaFiles = result.blobs.filter(blob => 
      blob.pathname.includes('media') || blob.pathname.includes('data/')
    );
    
    console.log('📷 Media-related files found:', mediaFiles.length);
    mediaFiles.forEach((blob, index) => {
      console.log(`${index + 1}. ${blob.pathname}`);
    });

    console.log('\n🎯 Testing media database file access:');
    const mediaDbFiles = result.blobs.filter(blob => 
      blob.pathname === 'data/media-files.json' || 
      blob.pathname.startsWith('data/media-files-')
    );
    
    console.log('📋 Media database files found:', mediaDbFiles.length);
    for (const dbFile of mediaDbFiles) {
      console.log(`\n📄 Testing file: ${dbFile.pathname}`);
      try {
        const response = await fetch(dbFile.url);
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ File accessible, contains ${Array.isArray(data) ? data.length : 'invalid'} items`);
          if (Array.isArray(data) && data.length > 0) {
            console.log('📦 Sample item:', {
              id: data[0].id,
              name: data[0].name,
              url: data[0].url
            });
          }
        } else {
          console.log(`❌ File not accessible: HTTP ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ Error accessing file: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Blob connection test failed:', error);
  }
}

testBlobConnection();