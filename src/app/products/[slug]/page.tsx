'use client';

import { notFound } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SectionTitle } from '@/components/ui/section-title';
import Link from 'next/link';
import Image from 'next/image';
import { Check, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/types';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'faq'>('overview');
  const [product, setProduct] = useState<Product | null>(null);
  const { products, getProductBySlug, loading } = useProducts();

  useEffect(() => {
    console.log('ProductPage useEffect triggered');
    console.log('Slug:', slug);
    console.log('Loading:', loading);
    console.log('Products count:', products.length);

    if (slug && !loading && products.length > 0) {
      console.log('Searching for product with slug:', slug);
      const foundProduct = products.find(p => p.slug === slug);
      console.log('Found product:', foundProduct ? foundProduct.title : 'NOT FOUND');
      setProduct(foundProduct || null);
    }
  }, [slug, loading, products]);

  // Debug render
  console.log('ProductPage render - slug:', slug, 'loading:', loading, 'product:', product?.title || 'null');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading product: {slug}</p>
        </div>
      </div>
    );
  }

  if (!product && !loading) {
    console.log('Product not found, showing 404');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p>Slug: {slug}</p>
          <p>Available products: {products.length}</p>
          <div className="mt-4">
            <h3>Available slugs:</h3>
            <ul>
              {products.map(p => (
                <li key={p.id}>{p.slug}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl p-8">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {product && product.heroImage && (
                <div className="w-full lg:w-80 aspect-video rounded-2xl overflow-hidden shadow-2xl bg-white flex-shrink-0 relative">
                  <Image
                    src={product.heroImage}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 320px"
                    className="object-contain transition-transform duration-300 hover:scale-105 p-4"
                    priority
                  />
                </div>
              )}
              {product && (
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/90 text-primary border-primary/20">
                    {product.category}
                  </Badge>
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                    <span className="text-gradient-shopee-tiktok">{product.title}</span>
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed">{product.shortDesc}</p>
                  <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="text-lg px-8 py-6 btn-gradient-markasai">
                    <Link href="/contact">
                      Book Demo
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-gradient-markasai hover:bg-gradient-to-r hover:from-markasai-gold-50 hover:to-markasai-blue-50">
                    <Link href="/pricing">
                      Lihat Harga
                    </Link>
                  </Button>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pricing'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pricing
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'faq'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              FAQ
            </button>
          </nav>
        </div>
      </section>

      {/* Tab Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {activeTab === 'overview' && (
          <div className="space-y-16">
            {product && product.benefits.length > 0 && (
              <section className="py-12 bg-muted/30 rounded-2xl">
                <div className="px-8">
                  <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold mb-4">Manfaat untuk Bisnis Anda</h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      Rasakan dampak positif yang nyata untuk operasional bisnis Anda
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {product.benefits.map((benefit, index) => (
                      <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-6 flex items-start space-x-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{benefit}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {product && product.features.length > 0 && (
              <section className="py-12">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold mb-4">Fitur Lengkap</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Semua fitur yang Anda butuhkan dalam satu platform
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {product.features.map((feature, index) => (
                    <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover-lift">
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                        <p className="font-medium text-gray-900">{feature}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery */}
            {product && product.gallery && product.gallery.length > 0 && (
              <section className="py-12">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold mb-4">Gallery Produk</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Lihat lebih dekat tampilan dan fitur produk kami
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {product.gallery.map((image, index) => (
                    <div key={index} className="group relative aspect-video rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover-lift bg-white">
                      <Image
                        src={image}
                        alt={`${product.title} - Gallery ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain transition-transform duration-300 group-hover:scale-105 p-4"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === 'pricing' && (
          <section className="py-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">Pilih Paket yang Tepat</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Dapatkan akses ke semua fitur dengan paket yang sesuai kebutuhan bisnis Anda
              </p>
            </div>

            {product && product.priceTiers && product.priceTiers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {product.priceTiers.map((tier, index) => (
                  <Card key={index} className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift ${
                    tier.popular
                      ? 'ring-2 ring-primary bg-gradient-to-br from-primary/5 to-secondary/5'
                      : 'hover:border-primary/20'
                  }`}>
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 text-sm font-semibold">
                          ⭐ Paling Populer
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-8 pt-8">
                      <CardTitle className="text-2xl font-bold mb-4">{tier.name}</CardTitle>
                      <div className="space-y-2">
                        <div className="text-4xl font-bold">
                          <span className="text-gradient-shopee-tiktok">{formatPrice(tier.price)}</span>
                        </div>
                        <p className="text-muted-foreground">
                          per {tier.period === 'monthly' ? 'bulan' : 'tahun'}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <ul className="space-y-4">
                        {tier.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-gray-700 leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button asChild className={`w-full py-6 text-lg font-semibold ${
                        tier.popular
                          ? 'btn-gradient-markasai'
                          : 'border-gradient-markasai hover:bg-gradient-to-r hover:from-markasai-gold-50 hover:to-markasai-blue-50'
                      }`} variant={tier.popular ? 'default' : 'outline'}>
                        <Link href="/contact">
                          {tier.popular ? 'Mulai Sekarang' : 'Pilih Paket'}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">💰</span>
                </div>
                <h4 className="text-xl font-semibold mb-2">Hubungi Kami untuk Harga</h4>
                <p className="text-muted-foreground mb-6">Dapatkan penawaran khusus sesuai kebutuhan bisnis Anda</p>
                <Button asChild className="btn-gradient-markasai">
                  <Link href="/contact">Konsultasi Gratis</Link>
                </Button>
              </div>
            )}
          </section>
        )}

        {activeTab === 'faq' && (
          <section className="py-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">Pertanyaan yang Sering Diajukan</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Temukan jawaban untuk pertanyaan umum tentang produk kami
              </p>
            </div>

            {product && product.faq && product.faq.length > 0 ? (
              <div className="max-w-4xl mx-auto space-y-6">
                {product.faq.map((faqItem, index) => (
                  <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">Q</span>
                          </div>
                          <h4 className="font-bold text-xl text-gray-900 leading-relaxed">{faqItem.question}</h4>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">A</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed text-lg">{faqItem.answer}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">❓</span>
                </div>
                <h4 className="text-xl font-semibold mb-2">Ada Pertanyaan?</h4>
                <p className="text-muted-foreground mb-6">Hubungi tim kami untuk mendapatkan jawaban yang Anda butuhkan</p>
                <Button asChild className="btn-gradient-markasai">
                  <Link href="/contact">Hubungi Kami</Link>
                </Button>
              </div>
            )}
          </section>
        )}
      </div>



      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Siap untuk Mencoba {product?.title}?
            </h2>
            <p className="text-xl opacity-90">
              Bergabung dengan ribuan bisnis yang telah merasakan manfaat AI untuk pertumbuhan mereka.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="/contact">
                  Book Demo Sekarang
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white btn-force-text-hover">
                <Link href="/pricing">
                  Lihat Paket Harga
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


