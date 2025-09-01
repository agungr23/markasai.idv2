// Media synchronization utilities for Vercel Blob storage
import { MediaFile } from '@/types';
import * as blobStorage from '@/lib/vercel-blob-storage';

/**
 * Synchronizes media database with Vercel Blob storage
 * Removes stale references that no longer exist in blob storage
 */
export async function syncMediaWithBlobStorage(): Promise<{
  synchronized: number;
  removed: number;
  errors: string[];
}> {
  const results = {
    synchronized: 0,
    removed: 0,
    errors: [] as string[]
  };

  try {
    console.log('🔄 Starting media synchronization with Vercel Blob...');
    
    // Get all media files from our database/storage
    const localMediaFiles = await blobStorage.getMediaFiles();
    console.log(`📊 Found ${localMediaFiles.length} files in local database`);

    // Get all files from Vercel Blob storage
    const blobFiles = await getAllBlobFiles();
    console.log(`☁️ Found ${blobFiles.length} files in Vercel Blob storage`);

    // Create a map of blob storage URLs for quick lookup
    const blobUrlMap = new Set(blobFiles.map(file => file.url));

    // Find files that exist in database but not in blob storage
    const staleFiles: MediaFile[] = [];
    const validFiles: MediaFile[] = [];

    for (const localFile of localMediaFiles) {
      // Check if file URL exists in blob storage
      const isInBlob = blobUrlMap.has(localFile.url) || 
                      blobFiles.some(blobFile => 
                        blobFile.pathname === getPathnameFromUrl(localFile.url) ||
                        blobFile.pathname.endsWith(localFile.name)
                      );

      if (isInBlob) {
        validFiles.push(localFile);
      } else {
        console.log(`❌ Stale file detected: ${localFile.name} (URL: ${localFile.url})`);
        staleFiles.push(localFile);
      }
    }

    // Remove stale files from database
    if (staleFiles.length > 0) {
      const staleIds = staleFiles.map(f => f.id);
      console.log(`🗑️ Removing ${staleFiles.length} stale files from database`);
      
      try {
        await blobStorage.deleteMediaFiles(staleIds);
        results.removed = staleFiles.length;
        console.log(`✅ Successfully removed ${staleFiles.length} stale files`);
      } catch (error) {
        console.error('❌ Error removing stale files:', error);
        results.errors.push(`Failed to remove stale files: ${error}`);
      }
    }

    results.synchronized = validFiles.length;
    console.log(`✅ Synchronization complete: ${validFiles.length} valid, ${staleFiles.length} removed`);

    return results;
  } catch (error) {
    console.error('❌ Media synchronization failed:', error);
    results.errors.push(`Synchronization failed: ${error}`);
    return results;
  }
}

/**
 * Get all files from Vercel Blob storage
 */
async function getAllBlobFiles() {
  try {
    const { list } = await import('@vercel/blob');
    const result = await list();
    return result.blobs || [];
  } catch (error) {
    console.error('❌ Error listing blob files:', error);
    return [];
  }
}

/**
 * Extract pathname from URL
 */
function getPathnameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    // If URL parsing fails, try to extract filename from the end
    return url.split('/').pop() || '';
  }
}

/**
 * Validate if a media file exists in Vercel Blob storage
 */
export async function validateMediaFileInBlob(mediaFile: MediaFile): Promise<boolean> {
  try {
    const blobFiles = await getAllBlobFiles();
    return blobFiles.some(blobFile => 
      blobFile.url === mediaFile.url ||
      blobFile.pathname === getPathnameFromUrl(mediaFile.url) ||
      blobFile.pathname.endsWith(mediaFile.name)
    );
  } catch (error) {
    console.error('❌ Error validating file in blob:', error);
    return false;
  }
}

/**
 * Auto-cleanup stale media references
 * This should be called periodically or after delete operations
 */
export async function autoCleanupStaleMedia(): Promise<void> {
  try {
    console.log('🧹 Running auto-cleanup for stale media references...');
    const results = await syncMediaWithBlobStorage();
    
    if (results.removed > 0) {
      console.log(`🧹 Auto-cleanup removed ${results.removed} stale references`);
    } else {
      console.log('✅ No stale references found during auto-cleanup');
    }
    
    if (results.errors.length > 0) {
      console.warn('⚠️ Auto-cleanup had errors:', results.errors);
    }
  } catch (error) {
    console.error('❌ Auto-cleanup failed:', error);
  }
}