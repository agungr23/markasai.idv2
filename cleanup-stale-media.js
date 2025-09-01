const { list, del } = require('@vercel/blob');

async function cleanupStaleMedia() {
    try {
        console.log('🔍 Checking for stale media references...');

        // Get current blob files
        const blobResult = await list({ prefix: 'media/' });
        console.log(`📁 Found ${blobResult.blobs.length} files in blob storage`);

        // Get database media list
        const dbResponse = await fetch(process.env.VERCEL_URL ?
            `https://${process.env.VERCEL_URL}/api/media` :
            'http://localhost:3000/api/media'
        );
        const dbData = await dbResponse.json();
        const dbFiles = dbData.files || [];

        console.log(`💾 Found ${dbFiles.length} files in database`);

        // Find stale references
        const staleFiles = [];
        const validBlobUrls = new Set(blobResult.blobs.map(blob => blob.url));

        for (const dbFile of dbFiles) {
            if (dbFile.url && dbFile.url.includes('blob.vercel-storage.com')) {
                if (!validBlobUrls.has(dbFile.url)) {
                    staleFiles.push(dbFile);
                }
            }
        }

        console.log(`🗑️ Found ${staleFiles.length} stale file references`);

        if (staleFiles.length > 0) {
            console.log('Stale files to remove:');
            staleFiles.forEach(file => {
                console.log(`- ${file.name} (ID: ${file.id})`);
            });

            // Delete stale references from database
            const staleIds = staleFiles.map(f => f.id);
            const deleteResponse = await fetch(process.env.VERCEL_URL ?
                `https://${process.env.VERCEL_URL}/api/media/delete` :
                'http://localhost:3000/api/media/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileIds: staleIds })
            });

            if (deleteResponse.ok) {
                console.log('✅ Successfully removed stale references from database');
            } else {
                console.error('❌ Failed to remove stale references');
            }
        } else {
            console.log('✅ No stale references found - database is in sync');
        }

    } catch (error) {
        console.error('❌ Cleanup failed:', error);
    }
}

cleanupStaleMedia();