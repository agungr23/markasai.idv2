import { NextResponse, NextRequest } from 'next/server';
import * as blobStorage from '@/lib/vercel-blob-storage';
import { MediaFile } from '@/types';

export async function GET() {
  try {
    console.log('🟢 Loading media from Vercel Blob storage');
    const mediaFiles = await blobStorage.getMediaFiles();
    
    // Sort by upload date (newest first)
    const sortedFiles = mediaFiles.sort((a, b) => parseInt(b.id) - parseInt(a.id));

    console.log('✅ Loaded', sortedFiles.length, 'media files from Blob');
    return NextResponse.json({ files: sortedFiles });
  } catch (error) {
    console.error('Error loading media files:', error);
    return NextResponse.json({ error: 'Failed to load media files' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate new media file entry (for manual/external uploads)
    const mediaFile: MediaFile = {
      id: Date.now().toString(),
      name: body.name || `${Date.now()}_uploaded_file`,
      originalName: body.originalName || body.name || 'uploaded_file',
      url: body.url || `/media/${body.name || `${Date.now()}_uploaded_file`}`,
      type: body.type || 'file',
      size: body.size || '0 KB',
      uploadedAt: new Date().toLocaleDateString('id-ID'),
      dimensions: body.dimensions || 'N/A',
      deletable: true,
      isStatic: false
    };
    
    console.log('🟢 Adding media to Vercel Blob storage');
    await blobStorage.addMediaFile(mediaFile);
    
    return NextResponse.json({
      success: true,
      message: 'File entry created successfully',
      file: mediaFile
    });
  } catch (error) {
    console.error('Error creating file entry:', error);
    return NextResponse.json({ error: 'Failed to create file entry' }, { status: 500 });
  }
}
