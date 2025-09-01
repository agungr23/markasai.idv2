// Quick sync fix for development
async function quickSyncFix() {
    try {
        console.log('🔍 Performing quick media sync check...');

        // Fetch current media list from API
        const response = await fetch('http://localhost:3000/api/media');
        const data = await response.json();
        const dbFiles = data.files || [];

        console.log(`📊 Database shows ${dbFiles.length} files:`);
        dbFiles.forEach((file, index) => {
            console.log(`${index + 1}. ${file.name} - ${file.url}`);
        });

        // Check each file to see if it actually exists
        const filesToDelete = [];

        for (const file of dbFiles) {
            if (file.url && file.url.includes('blob.vercel-storage.com')) {
                try {
                    console.log(`🔍 Checking: ${file.name}`);
                    const checkResponse = await fetch(file.url, { method: 'HEAD' });
                    if (checkResponse.status === 404) {
                        console.log(`❌ File not found in blob storage: ${file.name}`);
                        filesToDelete.push(file.id);
                    } else {
                        console.log(`✅ File exists: ${file.name}`);
                    }
                } catch (error) {
                    console.log(`❌ Error checking file ${file.name}:`, error.message);
                    filesToDelete.push(file.id);
                }
            }
        }

        if (filesToDelete.length > 0) {
            console.log(`\n🗑️ Removing ${filesToDelete.length} stale references...`);

            const deleteResponse = await fetch('http://localhost:3000/api/media/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileIds: filesToDelete })
            });

            if (deleteResponse.ok) {
                const result = await deleteResponse.json();
                console.log('✅ Successfully cleaned up stale references:', result);
            } else {
                console.log('❌ Failed to delete stale references');
            }
        } else {
            console.log('✅ No stale references found - database is in sync!');
        }

    } catch (error) {
        console.error('❌ Sync check failed:', error);
    }
}

// Run if Node.js
if (typeof window === 'undefined') {
    quickSyncFix();
}