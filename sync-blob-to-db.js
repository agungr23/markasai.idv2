// Migration script to sync existing Blob files with media database
const { list, put } = require('@vercel/blob');

async function syncBlobToDatabase() {
    try {
        console.log('🔄 Starting Blob to Database sync...');

        // List all files in media/ folder
        const { blobs } = await list({ prefix: 'media/' });
        console.log(`📁 Found ${blobs.length} files in Blob storage`);

        const mediaFiles = [];

        for (const blob of blobs) {
            // Extract filename from path
            const filename = blob.pathname.split('/').pop();
            const originalName = filename.split('_').slice(1).join('_'); // Remove timestamp prefix

            // Extract timestamp from filename (first part before underscore)
            const timestampMatch = filename.match(/^(\d+)_/);
            const timestamp = timestampMatch ? timestampMatch[1] : Date.now().toString();

            // Determine file type
            const extension = filename.split('.').pop()?.toLowerCase();
            let type = 'file';
            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
                type = 'image';
            } else if (['mp4', 'mov', 'webm'].includes(extension)) {
                type = 'video';
            }

            // Get file size from response headers
            let size = 'Unknown';
            try {
                const response = await fetch(blob.url, { method: 'HEAD' });
                const contentLength = response.headers.get('content-length');
                if (contentLength) {
                    const bytes = parseInt(contentLength);
                    const k = 1024;
                    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                    const i = Math.floor(Math.log(bytes) / Math.log(k));
                    size = parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
                }
            } catch (e) {
                console.warn(`⚠️ Could not get size for ${filename}`);
            }

            const mediaFile = {
                id: timestamp,
                name: filename,
                originalName: originalName,
                url: blob.url,
                type: type,
                size: size,
                uploadedAt: new Date(parseInt(timestamp)).toLocaleDateString('id-ID'),
                dimensions: type === 'image' ? 'Auto-detected' : 'N/A',
                deletable: true,
                isStatic: false
            };

            mediaFiles.push(mediaFile);
            console.log(`✅ Processed: ${filename} (${type}, ${size})`);
        }

        // Sort by timestamp (newest first)
        mediaFiles.sort((a, b) => parseInt(b.id) - parseInt(a.id));

        // Save to media database
        const jsonData = JSON.stringify(mediaFiles, null, 2);
        await put('data/media-files.json', jsonData, {
            access: 'public',
            contentType: 'application/json'
        });

        console.log(`🎉 Successfully synced ${mediaFiles.length} files to database!`);
        console.log('📋 Files synced:');
        mediaFiles.forEach(f => console.log(`   - ${f.originalName} (${f.size})`));

    } catch (error) {
        console.error('❌ Sync failed:', error);
        process.exit(1);
    }
}

syncBlobToDatabase();