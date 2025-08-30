'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { siteConfig } from '@/data/site';
import { useSettings } from '@/hooks/use-settings';
import { Instagram, Linkedin, Youtube } from 'lucide-react';

export function Footer() {
  const { settings, isLoading } = useSettings();

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2 group">
                {settings.logo ? (
                  <div className="h-8 w-8 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
                    <img
                      src={settings.logo}
                      alt={settings.siteName}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback to default logo if image fails to load
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                    <div className="hidden h-8 w-8 bg-gradient-markasai-gold rounded-lg items-center justify-center shadow-md group-hover:shadow-lg transition-all glow-markasai group-hover:scale-110">
                      <span className="text-white font-bold text-sm drop-shadow-sm">M</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-8 w-8 bg-gradient-markasai-gold rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all glow-markasai group-hover:scale-110">
                    <span className="text-white font-bold text-sm drop-shadow-sm">M</span>
                  </div>
                )}
                <span className="font-bold text-xl text-gradient-markasai">{settings.siteName}</span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {settings.siteDescription}
              </p>
              <div className="flex space-x-4">
                <Link
                  href={settings.instagram}
                  className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link
                  href={settings.linkedin}
                  className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link
                  href={settings.youtube}
                  className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-4">
              <h3 className="font-semibold">Produk</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/products/vidabot" className="text-muted-foreground hover:text-primary transition-colors">
                    VIDABOT
                  </Link>
                </li>
                <li>
                  <Link href="/products/ai-business-assistant" className="text-muted-foreground hover:text-primary transition-colors">
                    AI Business Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/products/ai-copy-marketing" className="text-muted-foreground hover:text-primary transition-colors">
                    AI Copy & Marketing
                  </Link>
                </li>
                <li>
                  <Link href="/products/ai-customer-support" className="text-muted-foreground hover:text-primary transition-colors">
                    AI Customer Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="font-semibold">Sumber Daya</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/case-studies" className="text-muted-foreground hover:text-primary transition-colors">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="font-semibold">Newsletter</h3>
              <p className="text-sm text-muted-foreground">
                Dapatkan tips AI terbaru dan update produk langsung ke email Anda.
              </p>
              <div className="flex space-x-2">
                <Input 
                  type="email" 
                  placeholder="Email Anda" 
                  className="flex-1"
                />
                <Button type="submit" size="sm" className="btn-gradient-markasai">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 {settings.siteName}. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/legal/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/legal/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
