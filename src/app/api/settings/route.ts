import { NextRequest, NextResponse } from 'next/server';
import {
  getSettingsFromStorage,
  updateSettingsInStorage,
  resetSettingsToDefaults,
  SiteSettings
} from '@/lib/settings-storage-edge';

// GET - Get current settings
export async function GET() {
  try {
    const settings = await getSettingsFromStorage();
    return NextResponse.json({
      success: true,
      settings: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // For maintenance mode, we only need to validate the boolean value
    if (body.hasOwnProperty('maintenanceMode') && typeof body.maintenanceMode !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'maintenanceMode must be a boolean value' },
        { status: 400 }
      );
    }

    const updatedSettings = await updateSettingsInStorage(body);

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

// POST - Reset settings to default
export async function POST() {
  try {
    const resetSettings = await resetSettingsToDefaults();

    return NextResponse.json({
      success: true,
      message: 'Settings reset to default successfully',
      settings: resetSettings
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset settings' },
      { status: 500 }
    );
  }
}
