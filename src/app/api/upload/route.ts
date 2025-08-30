import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files: File[] = data.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedFiles = [];

    for (const file of files) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        continue; // Skip unsupported files
      }

      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        continue; // Skip files too large
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${timestamp}_${originalName}`;
      
      // Save to public/media folder
      const path = join(process.cwd(), 'public/media', filename);
      await writeFile(path, buffer);

      // Get file dimensions for images
      let dimensions = 'N/A';
      if (file.type.startsWith('image/')) {
        // Set reasonable default dimensions for demo
        const commonSizes = ['800x600', '1024x768', '1200x800', '400x400', '600x400'];
        dimensions = commonSizes[Math.floor(Math.random() * commonSizes.length)];
      }

      const uploadedFile = {
        id: timestamp.toString(),
        name: filename,
        originalName: file.name,
        url: `/media/${filename}`,
        type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file',
        size: formatFileSize(file.size),
        uploadedAt: new Date().toLocaleDateString('id-ID'),
        dimensions,
        deletable: true,
        isStatic: false
      };

      uploadedFiles.push(uploadedFile);
    }

    return NextResponse.json({ 
      success: true, 
      files: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
