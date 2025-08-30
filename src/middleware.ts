import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSettingsFromStorage } from '@/lib/settings-storage-edge';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip maintenance check for admin routes, API routes, static files, and maintenance page
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/maintenance') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  try {
    // Check if maintenance mode is enabled
    const settings = await getSettingsFromStorage();
    
    if (settings.maintenanceMode) {
      // Redirect to maintenance page with 503 status
      const maintenanceUrl = new URL('/maintenance', request.url);
      const response = NextResponse.redirect(maintenanceUrl);
      
      // Set 503 Service Unavailable status for SEO
      response.headers.set('Retry-After', '3600'); // Retry after 1 hour
      
      return response;
    }
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
    // If there's an error reading settings, allow normal access
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin (admin routes)
     * - maintenance (maintenance page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|admin|maintenance).*)',
  ],
};
