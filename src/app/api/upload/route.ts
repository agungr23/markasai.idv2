import { NextRequest, NextResponse } from 'next/server';
import { uploadMediaToBlob } from '@/lib/vercel-blob-storage';
import { getEnvironmentInfo } from '@/lib/environment';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Upload API called');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('❌ No file in request');
      return NextResponse.json({ 
        error: 'No file uploaded',
        details: 'File not found in form data'
      }, { status: 400 });
    }

    console.log('📁 File received:', file.name, 'size:', file.size, 'type:', file.type);
    
    const env = getEnvironmentInfo();
    console.log('🌍 Environment:', {
      isProduction: env.isProduction,
      isVercel: env.isVercel,
      isServerless: env.isServerless
    });
    
    // Always use Vercel Blob storage
    console.log('🟢 Using Vercel Blob storage');
    try {
      const mediaFile = await uploadMediaToBlob(file);
      return NextResponse.json({
        success: true,
        file: mediaFile,
        message: 'File uploaded to Vercel Blob successfully'
      });
    } catch (error) {
      console.error('❌ Vercel Blob upload failed:', error);
      return NextResponse.json({
        error: 'Vercel Blob upload failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Check BLOB_READ_WRITE_TOKEN environment variable'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Upload API error:', error);
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
