'use client';

import { SectionTitle } from '@/components/ui/section-title';
import { ProductCard } from './product-card';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  description?: string;
  showAll?: boolean;
  limit?: number;
}

export function ProductGrid({
  title = "Solusi AI untuk Bisnis Anda",
  subtitle = "Produk Unggulan",
  description = "Pilih solusi AI yang tepat untuk mengoptimalkan bisnis Anda",
  showAll = false,
  limit = 4
}: ProductGridProps) {
  const { products, loading, getActiveProducts } = useProducts();

  if (loading) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={subtitle}
            title={title}
            description={description}
            centered
            className="mb-16"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: limit }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-video rounded-t-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const activeProducts = getActiveProducts();
  const displayProducts = showAll ? activeProducts : activeProducts.slice(0, limit);

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle={subtitle}
          title={title}
          description={description}
          centered
          className="mb-16"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {!showAll && activeProducts.length > limit && (
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/products">
                Lihat Semua Produk
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
