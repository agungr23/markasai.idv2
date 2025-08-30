// Simple authentication utilities for demo CMS
// In production, use proper authentication like NextAuth.js

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    return localStorage.getItem('admin_token') === 'authenticated';
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

export function login(email: string, password: string): boolean {
  // Simple demo authentication
  if (email === 'admin@markasai.id' && password === 'markasai2024') {
    localStorage.setItem('admin_token', 'authenticated');

    // Set cookie for server-side middleware
    document.cookie = 'admin_token=authenticated; path=/; max-age=86400'; // 24 hours

    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem('admin_token');

  // Clear cookie
  document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

export function requireAuth(): void {
  if (!isAuthenticated()) {
    window.location.href = '/admin/login';
  }
}
