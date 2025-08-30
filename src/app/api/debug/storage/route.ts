import { NextRequest, NextResponse } from 'next/server';
import { checkStorageHealth, debugStorageInfo, testAllStorageModules } from '@/lib/storage-debug';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'health';

  try {
    switch (action) {
      case 'health':
        const health = await checkStorageHealth();
        return NextResponse.json({
          success: true,
          health
        });

      case 'debug':
        const debugInfo = await debugStorageInfo();
        return NextResponse.json({
          success: true,
          debug: debugInfo
        });

      case 'test':
        const testResults = await testAllStorageModules();
        return NextResponse.json({
          success: true,
          test: testResults
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: health, debug, or test'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Storage debug API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Only allow in development or for admin users
export async function middleware(request: NextRequest) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (!isDevelopment) {
    // In production, you might want to check admin authentication
    // For now, just allow but log the access
    console.log('🔒 Storage debug endpoint accessed in production');
  }
  
  return NextResponse.next();
}