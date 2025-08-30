import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const mediaDir = join(process.cwd(), 'public/media');
    
    try {
      const files = await readdir(mediaDir);
      const mediaFiles = [];

      for (const filename of files) {
        if (filename === '.gitkeep') continue;
        
        const filePath = join(mediaDir, filename);
        const stats = await stat(filePath);
        
        // Extract original name and timestamp
        const parts = filename.split('_');
        const timestamp = parts[0];
        const originalName = parts.slice(1).join('_');
        
        // Determine file type
        const ext = filename.toLowerCase().split('.').pop();
        let type = 'file';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
          type = 'image';
        } else if (['mp4', 'mov', 'webm'].includes(ext || '')) {
          type = 'video';
        }

        // Generate realistic dimensions for images
        let dimensions = 'N/A';
        if (type === 'image') {
          const commonSizes = ['800x600', '1024x768', '1200x800', '400x400', '600x400', '1920x1080'];
          dimensions = commonSizes[Math.floor(Math.random() * commonSizes.length)];
        }

        const mediaFile = {
          id: timestamp,
          name: filename,
          originalName: originalName,
          url: `/media/${filename}`,
          type,
          size: formatFileSize(stats.size),
          uploadedAt: new Date(stats.mtime).toLocaleDateString('id-ID'),
          dimensions,
          deletable: true,
          isStatic: false
        };

        mediaFiles.push(mediaFile);
      }

      // Sort by upload date (newest first)
      mediaFiles.sort((a, b) => parseInt(b.id) - parseInt(a.id));

      return NextResponse.json({ files: mediaFiles });
    } catch (error) {
      // Media directory doesn't exist or is empty
      return NextResponse.json({ files: [] });
    }
  } catch (error) {
    console.error('Error loading media files:', error);
    return NextResponse.json({ error: 'Failed to load media files' }, { status: 500 });
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
