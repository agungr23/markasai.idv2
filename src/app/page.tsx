import { Hero } from '@/components/sections/hero';
import { MovementBlock } from '@/components/sections/movement-block';
import { ValuePillars } from '@/components/sections/value-pillars';
import { ProductGridWrapper } from '@/components/sections/product-grid-wrapper';
import { Steps } from '@/components/sections/steps';
import { Testimonials } from '@/components/sections/testimonials';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        badge="🚀 AI untuk Bisnis yang Lebih Efektif"
        title="AI untuk Bisnis yang Lebih Efektif & Efisien"
        subtitle="Bukan sekadar tren—AI membantu kerja lebih cepat, hemat biaya, dan tepat keputusan."
        primaryCTA={{
          text: "Lihat Solusi AI",
          href: "/products"
        }}
        secondaryCTA={{
          text: "Jadwalkan Demo",
          href: "/contact"
        }}
      />

      {/* Movement Block */}
      <MovementBlock />

      {/* Value Pillars */}
      <ValuePillars />

      {/* Product Catalog */}
      <ProductGridWrapper limit={4} />

      {/* How It Works */}
      <Steps />

      {/* Testimonials */}
      <Testimonials />

      {/* Final CTA */}
      <section className="py-24 bg-gradient-animated relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold drop-shadow-lg shimmer">
              Mulai gunakan AI untuk bisnismu hari ini
            </h2>
            <p className="text-xl opacity-90 drop-shadow-md">
              Bergabung dengan ribuan bisnis yang telah merasakan manfaat AI untuk pertumbuhan mereka.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-white text-markasai-blue hover:bg-gray-100 transition-colors shadow-lg hover-lift font-semibold">
                <Link href="/products">
                  Mulai Sekarang
                </Link>
              </Button>
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-transparent border-2 border-white text-white hover:bg-white transition-all duration-300 shadow-lg hover-lift font-bold btn-force-text-hover">
                <Link href="/contact">
                  Konsultasi Gratis
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
