'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { isAuthenticated } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setAuthChecked(true);
      setAuthenticated(true); // Allow login page to render
      return;
    }

    // Check authentication immediately
    const authStatus = isAuthenticated();

    if (!authStatus) {
      // Immediate redirect without rendering admin layout
      router.replace('/admin/login');
      return;
    }

    setAuthenticated(true);
    setAuthChecked(true);
  }, [router, pathname]);

  // If on login page, render without admin layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Don't render admin layout until auth is checked and confirmed
  if (!authChecked || !authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render admin layout if authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
