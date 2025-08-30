'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product, PriceTier } from '@/types';
import { X, Check, Star } from 'lucide-react';
import Image from 'next/image';

interface ProductPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productData: {
    title: string;
    shortDesc: string;
    description: string;
    category: string;
    heroImage: string;
    gallery: string[];
    features: string[];
    benefits: string[];
    priceTiers: PriceTier[];
    faq: { question: string; answer: string; }[];
  };
}

export default function ProductPreviewModal({ isOpen, onClose, productData }: ProductPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'faq'>('overview');

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Preview Produk</h2>
            <p className="text-gray-600">Pratinjau tampilan produk</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Hero Section */}
          <div className="mb-8 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl p-8">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {productData.heroImage && (
                <div className="w-full lg:w-80 aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-100 flex-shrink-0">
                  <img
                    src={productData.heroImage}
                    alt={productData.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/images/dummy-placeholder.svg';
                    }}
                  />
                </div>
              )}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/90 text-primary border-primary/20">
                    {productData.category}
                  </Badge>
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                    <span className="text-gradient-shopee-tiktok">{productData.title}</span>
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed">{productData.shortDesc}</p>
                  <p className="text-gray-700 leading-relaxed text-lg">{productData.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="text-lg px-8 py-6 btn-gradient-markasai">
                    Book Demo
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-gradient-markasai hover:bg-gradient-to-r hover:from-markasai-gold-50 hover:to-markasai-blue-50">
                    Lihat Harga
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b mb-6">
            <nav className="flex space-x-8">
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

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-16">
              {/* Benefits */}
              {productData.benefits.length > 0 && (
                <section className="py-12 bg-muted/30 rounded-2xl">
                  <div className="px-8">
                    <div className="text-center mb-12">
                      <h3 className="text-3xl font-bold mb-4">Manfaat untuk Bisnis Anda</h3>
                      <p className="text-muted-foreground max-w-2xl mx-auto">
                        Rasakan dampak positif yang nyata untuk operasional bisnis Anda
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {productData.benefits.map((benefit, index) => (
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

              {/* Features */}
              {productData.features.length > 0 && (
                <section className="py-12">
                  <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold mb-4">Fitur Lengkap</h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      Semua fitur yang Anda butuhkan dalam satu platform
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productData.features.map((feature, index) => (
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
              {productData.gallery.length > 0 && (
                <section className="py-12">
                  <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold mb-4">Gallery Produk</h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      Lihat lebih dekat tampilan dan fitur produk kami
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productData.gallery.map((image, index) => (
                      <div key={index} className="group relative aspect-video rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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

              {productData.priceTiers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {productData.priceTiers.map((tier, index) => (
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

                        <Button className={`w-full py-6 text-lg font-semibold ${
                          tier.popular
                            ? 'btn-gradient-markasai'
                            : 'border-gradient-markasai hover:bg-gradient-to-r hover:from-markasai-gold-50 hover:to-markasai-blue-50'
                        }`} variant={tier.popular ? 'default' : 'outline'}>
                          {tier.popular ? 'Mulai Sekarang' : 'Pilih Paket'}
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
                  <h4 className="text-xl font-semibold mb-2">Belum Ada Paket Harga</h4>
                  <p className="text-muted-foreground">Paket harga akan ditampilkan di sini setelah ditambahkan</p>
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

              {productData.faq.length > 0 ? (
                <div className="max-w-4xl mx-auto space-y-6">
                  {productData.faq.map((faqItem, index) => (
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
                  <h4 className="text-xl font-semibold mb-2">Belum Ada FAQ</h4>
                  <p className="text-muted-foreground">FAQ akan ditampilkan di sini setelah ditambahkan</p>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center gap-4 p-6 border-t bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="text-sm text-muted-foreground">
            Preview mode - Tampilan sebenarnya mungkin sedikit berbeda
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="px-6">
              Tutup Preview
            </Button>
            <Button className="btn-gradient-markasai px-6" onClick={onClose}>
              Lanjut Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
