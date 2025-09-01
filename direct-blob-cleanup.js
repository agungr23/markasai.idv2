// Direct blob cleanup - works without local server
const { list, del, put } = require('@vercel/blob');

// Set the token directly
process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_ZCM8MXIvSYth7ycM_SDuhRCh5wO8k32uqNTUyvmZ6FGQzsu';

async function directBlobCleanup() {
    try {
        console.log('🔍 Direct blob storage cleanup...');

        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            console.error('❌ BLOB_READ_WRITE_TOKEN not found in environment');
            return;
        }

        console.log('🔑 Token found, listing all blobs...');

        // List all blobs
        const allBlobs = await list();
        console.log(`📁 Total blobs found: ${allBlobs.blobs.length}`);

        // Separate media files from data files
        const mediaBlobs = allBlobs.blobs.filter(blob => blob.pathname.startsWith('media/'));
        const dataBlobs = allBlobs.blobs.filter(blob => blob.pathname === 'data/media-files.json');

        console.log(`🖼️ Media files in blob: ${mediaBlobs.length}`);
        console.log(`📄 Data files in blob: ${dataBlobs.length}`);

        // Show current media files
        if (mediaBlobs.length > 0) {
            console.log('\nCurrent media files in blob storage:');
            mediaBlobs.forEach((blob, index) => {
                console.log(`${index + 1}. ${blob.pathname} - ${blob.url}`);
            });
        }

        // Get the latest data file
        if (dataBlobs.length > 0) {
            console.log('\n📋 Checking database references...');

            // Get the most recent data file
            const latestDataBlob = dataBlobs[0]; // They should all be the same, but taking first one

            try {
                const response = await fetch(latestDataBlob.url);
                const dbFiles = await response.json();

                console.log(`💾 Database contains ${dbFiles.length} file references`);

                // Check which DB files don't have corresponding blobs
                const mediaUrls = new Set(mediaBlobs.map(blob => blob.url));
                const staleReferences = dbFiles.filter(file =>
                    file.url &&
                    file.url.includes('blob.vercel-storage.com') &&
                    !mediaUrls.has(file.url)
                );

                console.log(`🗑️ Found ${staleReferences.length} stale references in database`);

                if (staleReferences.length > 0) {
                    console.log('\nStale references to remove:');
                    staleReferences.forEach((file, index) => {
                        console.log(`${index + 1}. ${file.name} (ID: ${file.id})`);
                    });

                    // Create clean database without stale references
                    const cleanFiles = dbFiles.filter(file =>
                        !file.url ||
                        !file.url.includes('blob.vercel-storage.com') ||
                        mediaUrls.has(file.url)
                    );

                    console.log(`\n✅ Updating database to contain only ${cleanFiles.length} valid files...`);

                    // Upload clean data back to blob
                    await put('data/media-files.json', JSON.stringify(cleanFiles, null, 2), {
                        access: 'public',
                        contentType: 'application/json'
                    });

                    console.log('✅ Database cleaned and updated successfully!');

                } else {
                    console.log('✅ Database is already in sync with blob storage');
                }

            } catch (error) {
                console.error('❌ Error reading database file:', error);
            }
        }

    } catch (error) {
        console.error('❌ Cleanup failed:', error);
    }
}

directBlobCleanup();