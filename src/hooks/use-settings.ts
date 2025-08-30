import { useState, useEffect } from 'react';
import { SiteSettings } from '@/lib/settings-storage-edge';

// Default fallback settings
const defaultSettings: SiteSettings = {
  maintenanceMode: false,
  logo: '/images/logo.png',
  siteName: 'MarkasAI',
  siteDescription: 'AI untuk Bisnis yang Lebih Efektif & Efisien',
  siteUrl: 'https://markasai.id',
  email: 'hello@markasai.id',
  phone: '+62 812-3456-7890',
  address: 'Jakarta, Indonesia',
  instagram: 'https://instagram.com/markasai',
  linkedin: 'https://linkedin.com/company/markasai',
  youtube: 'https://youtube.com/@markasai',
  enableComments: true,
  enableNewsletter: true,
  enableAnalytics: true,
  metaTitle: 'MarkasAI - AI untuk Bisnis yang Lebih Efektif & Efisien',
  metaDescription: 'Bergabung dengan ribuan bisnis yang telah merasakan manfaat AI untuk pertumbuhan mereka.',
  ogImage: '/images/og-image.jpg',
  updatedAt: new Date().toISOString()
};

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/settings');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSettings(data.settings);
        } else {
          throw new Error(data.error || 'Failed to load settings');
        }
      } else {
        throw new Error('Failed to fetch settings');
      }
    } catch (err) {
      console.error('Error loading settings:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Keep using default settings on error
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
        return { success: true, settings: data.settings };
      } else {
        throw new Error(data.error || 'Failed to update settings');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const resetSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
        return { success: true, settings: data.settings };
      } else {
        throw new Error(data.error || 'Failed to reset settings');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    settings,
    isLoading,
    error,
    loadSettings,
    updateSettings,
    resetSettings
  };
}
