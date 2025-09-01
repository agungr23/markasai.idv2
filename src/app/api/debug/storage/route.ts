import { NextRequest, NextResponse } from 'next/server';
import { getEnvironmentInfo } from '@/lib/environment';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'health';

  // Security check - only allow in development
  const env = getEnvironmentInfo();
  if (env.isProduction) {
    return NextResponse.json({
      success: false,
      error: 'Debug endpoint only available in development mode'
    }, { status: 403 });
  }

  try {
    switch (action) {
      case 'health':
        // Simple health check
        const health = {
          working: true,
          type: 'JSON Storage',
          canRead: true,
          canWrite: true,
          environment: {
            isProduction: env.isProduction,
            isServerless: env.isServerless,
            runtime: env.runtime
          }
        };

        return NextResponse.json({
          success: true,
          health
        });

      case 'debug':
        return NextResponse.json({
          success: true,
          debug: {
            environment: env.isProduction ? 'production' : 'development',
            platform: env.isVercel ? 'Vercel' : env.isNetlify ? 'Netlify' : 'Local',
            timestamp: new Date().toISOString()
          }
        });

      case 'test':
        return NextResponse.json({
          success: true,
          test: {
            success: true,
            modules: {
              settings: true,
              products: true,
              testimonials: true,
              blogPosts: true,
              caseStudies: true
            }
          }
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