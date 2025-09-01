// Media storage handler - Environment aware
import { MediaFile } from '@/types';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// In-memory storage for production/Edge Runtime
let mediaFiles: MediaFile[] = [];

// Helper to detect environment capabilities
function canUseFileSystem() {
  try {
    // Check if we're in a server environment
    if (typeof window !== 'undefined') {
      return false; // Client-side
    }
    
    // Check if we're in development
    if (!isDevelopment) {
      return false; // Production
    }
    
    // Try to access require function
    if (typeof require === 'undefined') {
      return false; // No require available
    }
    
    // Try to require fs and path modules
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');
    
    return !!(fs && path);
  } catch (error) {
    console.log('⚠️ File system not available:', error);
    return false;
  }
}

// Initialize media data
async function initializeMediaData() {
  if (typeof window !== 'undefined') {
    // Client-side: Load from API
    try {
      const response = await fetch('/api/default-data/media');
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  } else if (canUseFileSystem()) {
    // Server-side development: Load from JSON file
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const fs = require('fs');
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const path = require('path');
      const filePath = path.join(process.cwd(), 'data/media.json');
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  } else {
    // Edge Runtime: Return empty array
    return [];
  }
}

// Load initial data
let dataInitialized = false;
async function ensureDataLoaded() {
  if (!dataInitialized) {
    const initialData = await initializeMediaData();
    mediaFiles = initialData;
    dataInitialized = true;
  }
}

// Get all media files
export async function getMediaFiles(): Promise<MediaFile[]> {
  if (canUseFileSystem()) {
    // Development: Always read fresh data from JSON file and validate physical files
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const fs = require('fs');
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const path = require('path');
      const filePath = path.join(process.cwd(), 'data/media.json');
      
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        const parsedData = JSON.parse(data);
        
        if (Array.isArray(parsedData)) {
          // Validate that physical files exist
          const validFiles = parsedData.filter(file => {
            const mediaPath = path.join(process.cwd(), 'public/media', file.name);
            const exists = fs.existsSync(mediaPath);
            if (!exists) {
              console.log(`⚠️ File missing: ${file.name}, removing from list`);
            }
            return exists;
          });
          
          // If we filtered out any files, update the JSON
          if (validFiles.length !== parsedData.length) {
            console.log(`🔄 Cleaning up media.json: ${parsedData.length} -> ${validFiles.length} files`);
            fs.writeFileSync(filePath, JSON.stringify(validFiles, null, 2));
          }
          
          console.log('📱 Loaded', validFiles.length, 'validated media files from JSON');
          return validFiles;
        }
      }
      
      console.log('⚠️ media.json file not found or invalid, returning empty array');
      return [];
    } catch (error) {
      console.error('❌ Error reading media.json:', error);
      return [];
    }
  } else {
    // Production: Use in-memory fallback
    await ensureDataLoaded();
    return [...mediaFiles];
  }
}

// Add media file
export async function addMediaFile(file: MediaFile): Promise<MediaFile> {
  if (canUseFileSystem()) {
    // Development: Always read current data first, then add and save
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const fs = require('fs');
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const path = require('path');
      const filePath = path.join(process.cwd(), 'data/media.json');
      
      // Read current data
      let currentFiles: MediaFile[] = [];
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        const parsedData = JSON.parse(data);
        currentFiles = Array.isArray(parsedData) ? parsedData : [];
      }
      
      // Add new file
      const updatedFiles = [...currentFiles, file];
      
      // Save back to file
      fs.writeFileSync(filePath, JSON.stringify(updatedFiles, null, 2));
      
      console.log('✅ Media file saved to JSON:', file.name);
      return file;
    } catch (error) {
      console.warn('⚠️ Could not save to JSON file:', error);
      // Fallback to memory
      await ensureDataLoaded();
      mediaFiles = [...mediaFiles, file];
      return file;
    }
  } else {
    // Production: Memory only
    await ensureDataLoaded();
    mediaFiles = [...mediaFiles, file];
    console.log('💾 Media file saved to memory (production mode):', file.name);
    return file;
  }
}

// Delete media files
export async function deleteMediaFiles(ids: string[]): Promise<{ deletedFiles: string[]; errors: string[] }> {
  const deletedFiles: string[] = [];
  const errors: string[] = [];
  
  if (canUseFileSystem()) {
    // Development: Read current data, filter, and save back
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const fs = require('fs');
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const path = require('path');
      const filePath = path.join(process.cwd(), 'data/media.json');
      
      // Read current data
      let currentFiles: MediaFile[] = [];
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        const parsedData = JSON.parse(data);
        currentFiles = Array.isArray(parsedData) ? parsedData : [];
      }
      
      // Collect files to delete for physical file cleanup
      const filesToDelete: MediaFile[] = [];
      
      // Filter out deleted files
      const filteredFiles = currentFiles.filter(file => {
        if (ids.includes(file.id)) {
          filesToDelete.push(file);
          deletedFiles.push(file.id);
          return false;
        }
        return true;
      });
      
      // Save updated data back to JSON
      fs.writeFileSync(filePath, JSON.stringify(filteredFiles, null, 2));
      console.log('✅ Media JSON updated after deletion');
      
      // Delete physical files from public/media
      for (const file of filesToDelete) {
        try {
          const mediaPath = path.join(process.cwd(), 'public/media', file.name);
          if (fs.existsSync(mediaPath)) {
            fs.unlinkSync(mediaPath);
            console.log('✅ Physical file deleted:', file.name);
          }
        } catch (error) {
          console.warn('⚠️ Could not delete physical file:', file.name, error);
        }
      }
      
    } catch (error) {
      console.error('❌ Error during file deletion:', error);
      errors.push('Failed to update media list');
    }
  } else {
    // Production: Memory only
    await ensureDataLoaded();
    
    for (const id of ids) {
      const index = mediaFiles.findIndex(file => file.id === id);
      if (index !== -1) {
        mediaFiles.splice(index, 1);
        deletedFiles.push(id);
      } else {
        errors.push(`File not found: ${id}`);
      }
    }
  }
  
  return { deletedFiles, errors };
}

// Upload handler for development
export async function handleFileUpload(formData: FormData): Promise<MediaFile | null> {
  if (!canUseFileSystem()) {
    throw new Error('File upload only available in development mode');
  }
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const path = require('path');
    
    const file = formData.get('file') as File;
    if (!file) return null;
    
    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}_${file.name}`;
    
    // Save to public/media directory
    const mediaDir = path.join(process.cwd(), 'public/media');
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
    }
    
    const filePath = path.join(mediaDir, filename);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    fs.writeFileSync(filePath, buffer);
    
    // Determine file type
    const ext = extension?.toLowerCase();
    let type: 'image' | 'video' | 'file' = 'file';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      type = 'image';
    } else if (['mp4', 'mov', 'webm'].includes(ext || '')) {
      type = 'video';
    }
    
    // Create media file object
    const mediaFile: MediaFile = {
      id: timestamp.toString(),
      name: filename,
      originalName: file.name,
      url: `/media/${filename}`,
      type,
      size: formatFileSize(file.size),
      uploadedAt: new Date().toLocaleDateString('id-ID'),
      dimensions: type === 'image' ? 'Calculating...' : 'N/A',
      deletable: true,
      isStatic: false
    };
    
    // Add to storage
    await addMediaFile(mediaFile);
    
    console.log('✅ File uploaded successfully:', filename);
    return mediaFile;
    
  } catch (error) {
    console.error('❌ File upload failed:', error);
    throw error;
  }
}

// Utility function
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}