import { NextRequest, NextResponse } from 'next/server';
import { getEnvironmentInfo } from '@/lib/environment';

// Import appropriate storage based on environment
import * as blobStorage from '@/lib/vercel-blob-storage';
import * as mediaStorage from '@/lib/media-storage';

export async function DELETE(request: NextRequest) {
  try {
    const { fileIds } = await request.json();

    if (!fileIds || !Array.isArray(fileIds)) {
      return NextResponse.json({ error: 'Invalid file IDs' }, { status: 400 });
    }

    const env = getEnvironmentInfo();
    let result: { deletedFiles: string[]; errors: string[] };
    
    if (env.isVercel && env.isProduction) {
      // Production: Use Vercel Blob storage
      console.log('🟢 Deleting media from Vercel Blob storage');
      result = await blobStorage.deleteMediaFiles(fileIds);
    } else {
      // Development: Use local media storage
      console.log('🟡 Deleting media from local JSON storage');
      result = await mediaStorage.deleteMediaFiles(fileIds);
    }

    return NextResponse.json({ 
      success: true,
      deletedFiles: result.deletedFiles,
      errors: result.errors,
      message: `${result.deletedFiles.length} file(s) deleted successfully`
    });

  } catch (error) {
    console.error('Delete API error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
