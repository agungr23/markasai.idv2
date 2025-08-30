// Edge Runtime compatible settings storage
// Uses in-memory storage since file system is not available in Edge Runtime

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

// In-memory storage for Edge Runtime compatibility
let settingsCache: SiteSettings | null = null;

// Load settings from cache or return defaults
export async function getSettingsFromStorage(): Promise<SiteSettings> {
  if (settingsCache) {
    return settingsCache;
  }
  
  // Return defaults if no cache
  settingsCache = { ...defaultSettings };
  return settingsCache;
}

// Save settings to cache
export async function saveSettingsToStorage(settings: SiteSettings): Promise<void> {
  try {
    // Update timestamp
    const updatedSettings = {
      ...settings,
      updatedAt: new Date().toISOString()
    };
    
    // Save to cache
    settingsCache = updatedSettings;
    console.log('✅ Settings saved to cache successfully');
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
