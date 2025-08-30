import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(request: NextRequest) {
  try {
    const { fileIds } = await request.json();

    if (!fileIds || !Array.isArray(fileIds)) {
      return NextResponse.json({ error: 'Invalid file IDs' }, { status: 400 });
    }

    const deletedFiles = [];
    const errors = [];

    for (const fileId of fileIds) {
      try {
        // Find the file in media directory
        const mediaDir = join(process.cwd(), 'public/media');
        const { readdir } = await import('fs/promises');
        const files = await readdir(mediaDir);
        
        // Find file that starts with the timestamp (fileId)
        const targetFile = files.find(filename => filename.startsWith(fileId + '_'));
        
        if (targetFile) {
          const filePath = join(mediaDir, targetFile);
          await unlink(filePath);
          deletedFiles.push(fileId);
          console.log('✅ Deleted file:', targetFile);
        } else {
          console.log('⚠️ File not found for ID:', fileId);
          errors.push(`File not found: ${fileId}`);
        }
      } catch (error) {
        console.error('❌ Error deleting file:', fileId, error);
        errors.push(`Failed to delete: ${fileId}`);
      }
    }

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
