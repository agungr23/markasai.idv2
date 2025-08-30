'use client';

import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/hooks/use-settings';
import { LogOut, ExternalLink } from 'lucide-react';

export function AdminHeader() {
  const router = useRouter();
  const { settings } = useSettings();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <a href="/admin" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{settings.siteName} CMS</h1>
              <p className="text-xs text-gray-500">Content Management System</p>
            </div>
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="/"
            target="_blank"
            className="flex items-center space-x-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Lihat Website
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
