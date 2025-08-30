import { NextRequest, NextResponse } from 'next/server';
import { deleteMediaFiles } from '@/lib/media-storage';

export async function DELETE(request: NextRequest) {
  try {
    const { fileIds } = await request.json();

    if (!fileIds || !Array.isArray(fileIds)) {
      return NextResponse.json({ error: 'Invalid file IDs' }, { status: 400 });
    }

    const { deletedFiles, errors } = await deleteMediaFiles(fileIds);

    return NextResponse.json({ 
      success: true,
      deletedFiles,
      errors,
      message: `${deletedFiles.length} file(s) deleted successfully`
    });

  } catch (error) {
    console.error('Delete API error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
