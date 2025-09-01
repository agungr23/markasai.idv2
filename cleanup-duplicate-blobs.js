// Cleanup duplicate blob files and keep only the best one
const { list, del, put } = require('@vercel/blob');

async function cleanupDuplicateBlobs() {
  try {
    console.log('🧹 Starting blob cleanup process...');
    
    // List all blobs
    const { blobs } = await list();
    console.log(`📊 Total blobs found: ${blobs.length}`);
    
    // Find all media database files
    const mediaDbFiles = blobs.filter(blob => 
      blob.pathname === 'data/media-files.json' || 
      blob.pathname.startsWith('data/media-files-')
    );
    
    console.log(`📋 Media database files found: ${mediaDbFiles.length}`);
    
    if (mediaDbFiles.length <= 1) {
      console.log('✅ No duplicates to clean up');
      return;
    }
    
    // Test each file and find the one with the most data
    let bestFile = null;
    let maxItems = -1;
    const fileData = [];
    
    console.log('\n🔍 Testing each database file...');
    
    for (const file of mediaDbFiles) {
      try {
        const response = await fetch(file.url);
        if (response.ok) {
          const data = await response.json();
          const itemCount = Array.isArray(data) ? data.length : 0;
          
          console.log(`  📄 ${file.pathname}: ${itemCount} items`);
          
          fileData.push({
            file: file,
            data: data,
            itemCount: itemCount
          });
          
          if (itemCount > maxItems) {
            maxItems = itemCount;
            bestFile = {
              file: file,
              data: data,
              itemCount: itemCount
            };
          }
        } else {
          console.log(`  ❌ ${file.pathname}: HTTP ${response.status}`);
        }
      } catch (error) {
        console.log(`  ❌ ${file.pathname}: Error - ${error.message}`);
      }
    }
    
    if (!bestFile) {
      console.log('❌ No valid database file found');
      return;
    }
    
    console.log(`\n🎯 Best file: ${bestFile.file.pathname} with ${bestFile.itemCount} items`);
    
    // Delete all other files
    console.log('\n🗑️ Deleting duplicate files...');
    
    for (const fileInfo of fileData) {
      if (fileInfo.file.url !== bestFile.file.url) {
        try {
          await del(fileInfo.file.url);
          console.log(`  ✅ Deleted: ${fileInfo.file.pathname}`);
        } catch (error) {
          console.log(`  ❌ Failed to delete ${fileInfo.file.pathname}: ${error.message}`);
        }
      }
    }
    
    // Create a clean version with the exact filename we expect
    console.log('\n📝 Creating clean database file...');
    
    try {
      const cleanData = JSON.stringify(bestFile.data, null, 2);
      const newBlob = await put('data/media-files.json', cleanData, {
        access: 'public',
        contentType: 'application/json'
      });
      
      console.log(`✅ Created clean database: ${newBlob.url}`);
      
      // If the best file wasn't the exact filename, delete it too
      if (bestFile.file.pathname !== 'data/media-files.json') {
        try {
          await del(bestFile.file.url);
          console.log(`  ✅ Deleted old best file: ${bestFile.file.pathname}`);
        } catch (error) {
          console.log(`  ⚠️ Failed to delete old best file: ${error.message}`);
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to create clean database:', error.message);
    }
    
    console.log('\n🎉 Cleanup completed!');
    console.log(`📊 Final result: 1 clean database file with ${bestFile.itemCount} items`);
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

cleanupDuplicateBlobs();
