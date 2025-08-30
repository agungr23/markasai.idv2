import { NextResponse } from 'next/server';
import { getSettingsFromStorage } from '@/lib/settings-storage-edge';

// GET - Get public settings (for SEO, metadata, etc.)
export async function GET() {
  try {
    const settings = await getSettingsFromStorage();
    
    // Only return public settings (no sensitive data)
    const publicSettings = {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      siteUrl: settings.siteUrl,
      logo: settings.logo,
      metaTitle: settings.metaTitle,
      metaDescription: settings.metaDescription,
      ogImage: settings.ogImage,
      instagram: settings.instagram,
      linkedin: settings.linkedin,
      youtube: settings.youtube,
      maintenanceMode: settings.maintenanceMode
    };
    
    return NextResponse.json({
      success: true,
      settings: publicSettings
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}
