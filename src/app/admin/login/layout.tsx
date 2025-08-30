import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Admin CMS MarkasAI',
  description: 'Login ke Content Management System MarkasAI',
  robots: 'noindex, nofollow',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page has its own layout without sidebar
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
