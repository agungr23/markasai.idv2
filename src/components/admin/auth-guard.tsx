'use client';

import { useEffect, useState } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authToken = localStorage.getItem('admin_token');
        const isAuth = authToken === 'authenticated';

        if (!isAuth) {
          // Immediate redirect without setting state
          window.location.href = '/admin/login';
          return;
        }

        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/admin/login';
      }
    };

    // Check auth immediately without delay
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
