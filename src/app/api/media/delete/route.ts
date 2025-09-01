import { NextRequest, NextResponse } from 'next/server';
import * as blobStorage from '@/lib/vercel-blob-storage';
import { broadcastMediaEvent } from '@/lib/media-events';

export async function DELETE(request: NextRequest) {
  try {
    const { fileIds } = await request.json();

    if (!fileIds || !Array.isArray(fileIds)) {
      return NextResponse.json({ error: 'Invalid file IDs' }, { status: 400 });
    }

    console.log('🟢 Deleting media from Vercel Blob storage');
    const result = await blobStorage.deleteMediaFiles(fileIds);

    // Broadcast real-time event
    broadcastMediaEvent({
      type: 'delete',
      data: {
        deletedFiles: result.deletedFiles,
        errors: result.errors,
        message: `${result.deletedFiles.length} file(s) deleted`
      }
    });

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
