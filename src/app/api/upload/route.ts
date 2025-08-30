import { NextRequest, NextResponse } from 'next/server';
import { handleFileUpload } from '@/lib/media-storage';

export async function POST(request: NextRequest) {
  try {
    // Check if we're in development mode
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({
        error: 'File upload only available in development mode. In production, use cloud storage.',
        suggestion: 'Consider using Cloudinary, AWS S3, or similar service for production file uploads.'
      }, { status: 400 });
    }

    const formData = await request.formData();
    const uploadedFile = await handleFileUpload(formData);

    if (!uploadedFile) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      file: uploadedFile
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
