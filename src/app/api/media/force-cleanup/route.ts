// API endpoint for force cleanup of stale media
import { NextResponse } from 'next/server';
import { forceCleanupStaleMedia } from '@/lib/force-cleanup';
import { broadcastMediaEvent } from '@/lib/media-events';

export async function POST() {
  try {
    console.log('🚨 Force cleanup API called');
    
    // Run force cleanup
    const results = await forceCleanupStaleMedia();
    
    // Broadcast update if files were removed
    if (results.removed.length > 0) {
      broadcastMediaEvent({
        type: 'update',
        data: {
          message: `Force cleanup: ${results.removed.length} stale files removed`,
          removed: results.removed.length,
          totalAfter: results.totalAfter
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Force cleanup completed',
      results: {
        totalBefore: results.totalBefore,
        totalAfter: results.totalAfter,
        removed: results.removed.length,
        removedFiles: results.removed.map(f => ({ id: f.id, name: f.name, url: f.url })),
        errors: results.errors
      }
    });
  } catch (error) {
    console.error('❌ Force cleanup API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Force cleanup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}