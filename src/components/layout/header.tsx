'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { navigationItems } from '@/data/site';
import { useSettings } from '@/hooks/use-settings';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSettings();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {item.items.map((subItem) => (
                            <li key={subItem.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={subItem.href}
                                  className={cn(
                                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  )}
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {subItem.title}
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {subItem.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      >
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button asChild className="btn-gradient-markasai hover-lift">
              <Link href="/contact">Jadwalkan Demo</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  <Link
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                  {item.items && (
                    <div className="pl-4 space-y-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className="block px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4">
                <Button asChild className="w-full btn-gradient-markasai">
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                    Jadwalkan Demo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
