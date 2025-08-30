'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import Link from 'next/link';

const pricingPlans = [
  {
    name: 'Basic',
    description: 'Cocok untuk UMKM dan bisnis kecil yang baru memulai dengan AI',
    monthlyPrice: 299000,
    yearlyPrice: 2990000,
    features: [
      'Akses ke 2 produk AI pilihan',
      '1000 queries per bulan',
      'Email support',
      'Tutorial dasar',
      'Dashboard analytics sederhana'
    ],
    popular: false
  },
  {
    name: 'Pro',
    description: 'Ideal untuk bisnis menengah yang ingin mengoptimalkan operasional',
    monthlyPrice: 699000,
    yearlyPrice: 6990000,
    features: [
      'Akses ke semua produk AI',
      'Unlimited queries',
      'Priority support',
      'Tutorial lengkap + webinar',
      'Advanced analytics',
      'Custom branding',
      'API access',
      'Integrasi dengan tools bisnis'
    ],
    popular: true
  },
  {
    name: 'Business',
    description: 'Solusi enterprise untuk perusahaan besar dengan kebutuhan khusus',
    monthlyPrice: 1499000,
    yearlyPrice: 14990000,
    features: [
      'Semua fitur Pro',
      'Dedicated account manager',
      'Custom AI development',
      'White-label solution',
      'On-premise deployment',
      'SLA guarantee',
      'Training untuk tim',
      'Konsultasi strategi AI'
    ],
    popular: false
  }
];

export function PricingTable() {
  const [isYearly, setIsYearly] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toggle */}
        <div className="flex justify-center mb-16">
          <div className="bg-muted p-1 rounded-lg">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                !isYearly 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                isYearly 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Tahunan
              <Badge variant="secondary" className="ml-2 text-xs">
                Hemat 17%
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                plan.popular ? 'ring-2 ring-primary' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-markasai text-white px-4 py-1 shadow-lg glow-markasai float-animation">
                    Paling Populer
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <p className="text-muted-foreground text-sm mt-2">
                  {plan.description}
                </p>
                
                <div className="mt-6">
                  <div className="text-4xl font-bold">
                    {formatPrice(isYearly ? plan.yearlyPrice : plan.monthlyPrice)}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    per {isYearly ? 'tahun' : 'bulan'}
                  </div>
                  {isYearly && (
                    <div className="text-xs text-primary mt-1">
                      Hemat {formatPrice((plan.monthlyPrice * 12) - plan.yearlyPrice)}
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  asChild
                  className={`w-full ${plan.popular ? 'btn-gradient-markasai hover-lift' : 'border-gradient-markasai hover:bg-gradient-to-r hover:from-markasai-gold-50 hover:to-markasai-blue-50 hover-lift btn-force-text-hover'}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <Link href="/contact">
                    {plan.name === 'Business' ? 'Hubungi Sales' : 'Mulai Sekarang'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16 space-y-4">
          <p className="text-muted-foreground">
            Semua paket termasuk free trial 14 hari. Tidak ada biaya setup atau kontrak jangka panjang.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild variant="outline" className="btn-force-text-hover">
              <Link href="/contact">
                Konsultasi Gratis
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/products">
                Bandingkan Fitur Detail
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
