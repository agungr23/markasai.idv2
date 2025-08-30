'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  Save, 
  Settings,
  Globe,
  Mail,
  Shield,
  Database,
  Palette
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Set document title
  useEffect(() => {
    document.title = 'Pengaturan Situs - Admin MarkasAI';
  }, []);

  const [settings, setSettings] = useState({
    // Core Settings
    maintenanceMode: false,
    logo: '',

    // Site Settings
    siteName: '',
    siteDescription: '',
    siteUrl: '',

    // Contact Settings
    email: '',
    phone: '',
    address: '',

    // Social Media
    instagram: '',
    linkedin: '',
    youtube: '',

    // SEO
    metaTitle: '',
    metaDescription: '',
    ogImage: ''
  });

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSettings(data.settings);
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setError('Gagal memuat pengaturan');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        console.log('✅ Settings saved successfully');

        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || 'Gagal menyimpan pengaturan');
      }
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      setError('Gagal menyimpan pengaturan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Apakah Anda yakin ingin mereset semua pengaturan ke default?')) {
      return;
    }

    setIsResetting(true);
    setError('');

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
        setSuccess(true);
        console.log('✅ Settings reset successfully');

        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || 'Gagal mereset pengaturan');
      }
    } catch (error) {
      console.error('❌ Error resetting settings:', error);
      setError('Gagal mereset pengaturan');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan Situs</h1>
          <p className="text-gray-600">Kelola pengaturan website dan mode maintenance</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleReset}
            variant="outline"
            disabled={isLoading || isResetting}
          >
            {isResetting ? 'Mereset...' : 'Reset ke Default'}
          </Button>

          <Button
            form="settings-form"
            type="submit"
            className="btn-gradient-markasai"
            disabled={isLoading || isResetting}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </div>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            ✅ Pengaturan situs berhasil diperbarui!
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            ❌ {error}
          </AlertDescription>
        </Alert>
      )}

      <form id="settings-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Site Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Pengaturan Website
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nama Website</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteUrl">URL Website</Label>
                <Input
                  id="siteUrl"
                  value={settings.siteUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Deskripsi Website</Label>
              <textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Informasi Kontak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={settings.instagram}
                onChange={(e) => setSettings(prev => ({ ...prev, instagram: e.target.value }))}
                placeholder="https://instagram.com/markasai"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={settings.linkedin}
                onChange={(e) => setSettings(prev => ({ ...prev, linkedin: e.target.value }))}
                placeholder="https://linkedin.com/company/markasai"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                id="youtube"
                value={settings.youtube}
                onChange={(e) => setSettings(prev => ({ ...prev, youtube: e.target.value }))}
                placeholder="https://youtube.com/@markasai"
              />
            </div>
          </CardContent>
        </Card>

        {/* Logo Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              Logo Website
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {/* Current Logo Preview */}
              {settings.logo && (
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                  <div className="w-16 h-16 bg-white rounded-lg border flex items-center justify-center overflow-hidden">
                    <img
                      src={settings.logo}
                      alt="Current Logo"
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                    <div className="hidden w-full h-full bg-gray-200 items-center justify-center text-gray-500 text-xs">
                      No Image
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Logo Saat Ini</p>
                    <p className="text-sm text-gray-600">{settings.logo}</p>
                  </div>
                </div>
              )}

              {/* Logo URL Input */}
              <div className="space-y-2">
                <Label htmlFor="logo">URL Logo</Label>
                <Input
                  id="logo"
                  value={settings.logo}
                  onChange={(e) => setSettings(prev => ({ ...prev, logo: e.target.value }))}
                  placeholder="/images/logo.png atau https://example.com/logo.png"
                />
                <p className="text-xs text-gray-500">
                  Masukkan path logo (contoh: /images/logo.png) atau URL lengkap
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mode Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Mode Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="maintenanceMode" className="text-lg font-medium">Mode Maintenance</Label>
                <p className="text-sm text-gray-600 mt-1">Aktifkan halaman maintenance untuk pengunjung</p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                className="scale-125"
              />
            </div>

            {settings.maintenanceMode && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertDescription className="text-orange-800">
                  ⚠️ Mode maintenance sedang aktif! Pengunjung akan melihat halaman maintenance.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO & Meta Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={settings.metaTitle}
                onChange={(e) => setSettings(prev => ({ ...prev, metaTitle: e.target.value }))}
                maxLength={60}
              />
              <p className="text-xs text-gray-500">{settings.metaTitle.length}/60 karakter</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <textarea
                id="metaDescription"
                value={settings.metaDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, metaDescription: e.target.value }))}
                className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={160}
              />
              <p className="text-xs text-gray-500">{settings.metaDescription.length}/160 karakter</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ogImage">Open Graph Image</Label>
              <Input
                id="ogImage"
                value={settings.ogImage}
                onChange={(e) => setSettings(prev => ({ ...prev, ogImage: e.target.value }))}
                placeholder="/images/og-image.jpg"
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
