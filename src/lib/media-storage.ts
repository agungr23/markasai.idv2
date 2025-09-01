// Media storage handler - Environment aware
import { MediaFile } from '@/types';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// In-memory storage for production/Edge Runtime
let mediaFiles: MediaFile[] = [];

// Helper to detect environment capabilities
function canUseFileSystem() {
  try {
    return isDevelopment && typeof require !== 'undefined';
  } catch {
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
  await ensureDataLoaded();
  return [...mediaFiles];
}

// Add media file
export async function addMediaFile(file: MediaFile): Promise<MediaFile> {
  await ensureDataLoaded();
  
  if (canUseFileSystem()) {
    // Development: Try to save to JSON file
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const fs = require('fs');
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const path = require('path');
      
      mediaFiles = [...mediaFiles, file];
      const filePath = path.join(process.cwd(), 'data/media.json');
      fs.writeFileSync(filePath, JSON.stringify(mediaFiles, null, 2));
      
      console.log('✅ Media file saved to JSON:', file.name);
    } catch (error) {
      console.warn('⚠️ Could not save to JSON file, using memory only:', error);
      mediaFiles = [...mediaFiles, file];
    }
  } else {
    // Production: Memory only
    mediaFiles = [...mediaFiles, file];
    console.log('💾 Media file saved to memory (production mode):', file.name);
  }
  
  return file;
}

// Delete media files
export async function deleteMediaFiles(ids: string[]): Promise<{ deletedFiles: string[]; errors: string[] }> {
  await ensureDataLoaded();
  
  const deletedFiles: string[] = [];
  const errors: string[] = [];
  
  for (const id of ids) {
    const index = mediaFiles.findIndex(file => file.id === id);
    if (index !== -1) {
      const deletedFile = mediaFiles[index];
      mediaFiles.splice(index, 1);
      deletedFiles.push(id);
      
      if (canUseFileSystem()) {
        // Development: Try to update JSON file
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
          const fs = require('fs');
          // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
          const path = require('path');
          const filePath = path.join(process.cwd(), 'data/media.json');
          fs.writeFileSync(filePath, JSON.stringify(mediaFiles, null, 2));
          console.log('✅ Media JSON updated after deletion');
        } catch (error) {
          console.warn('⚠️ Could not update JSON file:', error);
        }
        
        // Try to delete actual file from public/media
        try {
          if (canUseFileSystem()) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
            const fs = require('fs');
            // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
            const path = require('path');
            
            const mediaPath = path.join(process.cwd(), 'public/media', deletedFile.name);
            if (fs.existsSync(mediaPath)) {
              fs.unlinkSync(mediaPath);
              console.log('✅ Physical file deleted:', deletedFile.name);
            }
          }
        } catch (error) {
          console.warn('⚠️ Could not delete physical file:', error);
        }
      }
    } else {
      errors.push(`File not found: ${id}`);
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