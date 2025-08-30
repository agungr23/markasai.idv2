// Universal settings storage that works in both development and production
// Uses hybrid storage strategy for reliability

import { getStorageAdapter } from './storage-adapter';

// Settings interface - Logo and maintenance mode
export interface SiteSettings {
  // Core settings
  maintenanceMode: boolean;
  logo: string; // Logo URL/path
  
  // Keep minimal site info for compatibility
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  enableComments: boolean;
  enableNewsletter: boolean;
  enableAnalytics: boolean;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  
  // Additional settings
  updatedAt: string;
}

// Default settings data
const defaultSettings: SiteSettings = {
  // Core Settings
  maintenanceMode: false,
  logo: '/images/logo.png', // Default logo path
  
  // Site Settings
  siteName: 'MarkasAI',
  siteDescription: 'AI untuk Bisnis yang Lebih Efektif & Efisien',
  siteUrl: 'https://markasai.id',
  
  // Contact Settings
  email: 'hello@markasai.id',
  phone: '+62 812-3456-7890',
  address: 'Jakarta, Indonesia',
  
  // Social Media
  instagram: 'https://instagram.com/markasai',
  linkedin: 'https://linkedin.com/company/markasai',
  youtube: 'https://youtube.com/@markasai',
  
  // Features
  enableComments: true,
  enableNewsletter: true,
  enableAnalytics: true,
  
  // SEO
  metaTitle: 'MarkasAI - AI untuk Bisnis yang Lebih Efektif & Efisien',
  metaDescription: 'Bergabung dengan ribuan bisnis yang telah merasakan manfaat AI untuk pertumbuhan mereka.',
  ogImage: '/images/og-image.jpg',
  
  // Additional
  updatedAt: new Date().toISOString()
};

// Load settings using universal storage adapter
export async function getSettingsFromStorage(): Promise<SiteSettings> {
  const storage = getStorageAdapter();
  return await storage.read('settings', defaultSettings);
}

// Save settings using universal storage adapter
export async function saveSettingsToStorage(settings: SiteSettings): Promise<void> {
  try {
    // Update timestamp
    const updatedSettings = {
      ...settings,
      updatedAt: new Date().toISOString()
    };
    
    const storage = getStorageAdapter();
    await storage.write('settings', updatedSettings);
    console.log('✅ Settings saved successfully');
  } catch (error) {
    console.error('❌ Error saving settings:', error);
    throw new Error('Failed to save settings');
  }
}

// Update specific settings
export async function updateSettingsInStorage(newSettings: Partial<SiteSettings>): Promise<SiteSettings> {
  const currentSettings = await getSettingsFromStorage();
  const updatedSettings = {
    ...currentSettings,
    ...newSettings,
    updatedAt: new Date().toISOString()
  };
  
  await saveSettingsToStorage(updatedSettings);
  return updatedSettings;
}

// Reset settings to defaults
export async function resetSettingsToDefaults(): Promise<SiteSettings> {
  const resetSettings = {
    ...defaultSettings,
    updatedAt: new Date().toISOString()
  };
  
  await saveSettingsToStorage(resetSettings);
  return resetSettings;
}
