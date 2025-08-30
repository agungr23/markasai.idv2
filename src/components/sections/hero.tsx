import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface HeroProps {
  badge?: string;
  title: string;
  subtitle: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  backgroundImage?: string;
}

export function Hero({
  badge,
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  backgroundImage
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}
      
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-markasai-gold-400/8 via-markasai-orange-500/5 to-markasai-blue-800/8" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {badge && (
            <Badge variant="secondary" className="text-sm px-4 py-2">
              {badge}
            </Badge>
          )}
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
            <span className="text-gradient-markasai">
              {title}
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 btn-gradient-markasai hover-lift">
              <Link href={primaryCTA.href}>
                {primaryCTA.text}
              </Link>
            </Button>

            {secondaryCTA && (
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-gradient-markasai hover:bg-gradient-to-r hover:from-markasai-gold-50 hover:to-markasai-blue-50 transition-all hover-lift btn-force-text-hover">
                <Link href={secondaryCTA.href}>
                  {secondaryCTA.text}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Enhanced Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-markasai-gold-400/25 to-markasai-orange-500/15 rounded-full blur-3xl float-animation" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-markasai-blue-800/25 to-markasai-blue-600/15 rounded-full blur-3xl float-animation" style={{animationDelay: '2s'}} />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-r from-markasai-orange-500/20 to-markasai-blue-700/15 rounded-full blur-2xl float-animation" style={{animationDelay: '4s'}} />
    </section>
  );
}
