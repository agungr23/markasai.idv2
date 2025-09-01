// API endpoint for media synchronization
import { NextResponse } from 'next/server';
import { syncMediaWithBlobStorage, autoCleanupStaleMedia } from '@/lib/media-sync';
import { broadcastMediaEvent } from '@/lib/media-events';

export async function POST() {
  try {
    console.log('🔄 Manual media synchronization requested');
    
    // Run synchronization
    const results = await syncMediaWithBlobStorage();
    
    // Broadcast update if files were removed
    if (results.removed > 0) {
      broadcastMediaEvent({
        type: 'update',
        data: {
          message: `Synchronized media: ${results.removed} stale files removed`,
          synchronized: results.synchronized,
          removed: results.removed
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Media synchronization completed',
      results: {
        synchronized: results.synchronized,
        removed: results.removed,
        errors: results.errors
      }
    });
  } catch (error) {
    console.error('❌ Media synchronization API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Synchronization failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Auto-cleanup on GET request (for health checks)
    await autoCleanupStaleMedia();
    
    return NextResponse.json({
      success: true,
      message: 'Auto-cleanup completed'
    });
  } catch (error) {
    console.error('❌ Auto-cleanup API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Auto-cleanup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}