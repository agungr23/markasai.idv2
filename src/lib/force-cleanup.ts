// Force cleanup utility for stale media references
import { MediaFile } from '@/types';
import * as blobStorage from '@/lib/vercel-blob-storage';

/**
 * Force cleanup all media files that don't exist in blob storage
 * This is a more aggressive approach for persistent stale files
 */
export async function forceCleanupStaleMedia(): Promise<{
  totalBefore: number;
  totalAfter: number;
  removed: MediaFile[];
  errors: string[];
}> {
  const results = {
    totalBefore: 0,
    totalAfter: 0,
    removed: [] as MediaFile[],
    errors: [] as string[]
  };

  try {
    console.log('🚨 FORCE CLEANUP: Starting aggressive stale media cleanup...');
    
    // Get all media files from database
    const allMediaFiles = await blobStorage.getMediaFiles();
    results.totalBefore = allMediaFiles.length;
    console.log(`📊 Found ${allMediaFiles.length} files in database`);

    // Get all files from Vercel Blob storage
    const { list } = await import('@vercel/blob');
    const blobResult = await list();
    const blobFiles = blobResult.blobs || [];
    console.log(`☁️ Found ${blobFiles.length} files in Vercel Blob storage`);

    // Create comprehensive lookup maps
    const blobUrls = new Set(blobFiles.map(f => f.url));
    const blobPathnames = new Set(blobFiles.map(f => f.pathname));
    const blobFilenames = new Set(blobFiles.map(f => f.pathname.split('/').pop()).filter(Boolean));

    console.log('🔍 Blob storage URLs:', Array.from(blobUrls).slice(0, 3));
    console.log('🔍 Blob storage pathnames:', Array.from(blobPathnames).slice(0, 3));
    console.log('🔍 Blob storage filenames:', Array.from(blobFilenames).slice(0, 3));

    // Check each media file
    const validFiles: MediaFile[] = [];
    const staleFiles: MediaFile[] = [];

    for (const mediaFile of allMediaFiles) {
      let isValid = false;
      
      // Check 1: Direct URL match
      if (blobUrls.has(mediaFile.url)) {
        isValid = true;
      }
      
      // Check 2: Pathname extraction and match
      if (!isValid) {
        try {
          const url = new URL(mediaFile.url);
          if (blobPathnames.has(url.pathname)) {
            isValid = true;
          }
        } catch {
          // URL parsing failed, continue with other checks
        }
      }
      
      // Check 3: Filename match
      if (!isValid && blobFilenames.has(mediaFile.name)) {
        isValid = true;
      }
      
      // Check 4: Check if URL contains blob.vercel-storage.com and file doesn't exist
      if (!isValid && mediaFile.url.includes('blob.vercel-storage.com')) {
        // This is definitely a blob storage file that no longer exists
        console.log(`❌ STALE BLOB FILE: ${mediaFile.name} (${mediaFile.url})`);
      }
      
      if (isValid) {
        validFiles.push(mediaFile);
        console.log(`✅ VALID: ${mediaFile.name}`);
      } else {
        staleFiles.push(mediaFile);
        console.log(`❌ STALE: ${mediaFile.name} (URL: ${mediaFile.url})`);
      }
    }

    console.log(`📊 Analysis complete: ${validFiles.length} valid, ${staleFiles.length} stale`);

    // Force remove all stale files
    if (staleFiles.length > 0) {
      const staleIds = staleFiles.map(f => f.id);
      console.log(`🗑️ FORCE REMOVING ${staleFiles.length} stale files:`, staleIds);
      
      try {
        const deleteResult = await blobStorage.deleteMediaFiles(staleIds);
        console.log('✅ Force delete result:', deleteResult);
        
        results.removed = staleFiles;
        results.totalAfter = validFiles.length;
        
        console.log(`🧹 FORCE CLEANUP COMPLETE: Removed ${staleFiles.length} stale files`);
      } catch (error) {
        console.error('❌ Error during force cleanup:', error);
        results.errors.push(`Failed to remove stale files: ${error}`);
      }
    } else {
      results.totalAfter = validFiles.length;
      console.log('✅ No stale files found during force cleanup');
    }

    return results;
  } catch (error) {
    console.error('❌ Force cleanup failed:', error);
    results.errors.push(`Force cleanup failed: ${error}`);
    return results;
  }
}

/**
 * Validate each file by actually checking its existence in blob storage
 */
export async function validateMediaFileExists(mediaFile: MediaFile): Promise<boolean> {
  try {
    // If it's not a blob storage URL, consider it valid (local dev file)
    if (!mediaFile.url.includes('blob.vercel-storage.com')) {
      return true;
    }

    // For blob storage files, try to fetch the file
    const response = await fetch(mediaFile.url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}