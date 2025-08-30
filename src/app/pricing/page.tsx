import { Metadata } from 'next';
import { SectionTitle } from '@/components/ui/section-title';
import { PricingTable } from '@/components/sections/pricing-table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, Headphones, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Harga & Paket - MarkasAI',
  description: 'Pilih paket AI yang sesuai dengan kebutuhan bisnis Anda. Mulai dari Basic hingga Enterprise dengan fitur lengkap.',
  keywords: ['harga markasai', 'paket ai', 'pricing', 'biaya ai tools'],
};

const benefits = [
  {
    icon: Shield,
    title: 'Garansi 30 Hari',
    description: 'Tidak puas? Dapatkan refund 100% dalam 30 hari pertama'
  },
  {
    icon: Clock,
    title: 'Free Trial 14 Hari',
    description: 'Coba semua fitur gratis selama 14 hari tanpa komitmen'
  },
  {
    icon: Headphones,
    title: 'Support 24/7',
    description: 'Tim support siap membantu Anda kapan saja dibutuhkan'
  },
  {
    icon: Zap,
    title: 'Setup Instan',
    description: 'Mulai menggunakan AI dalam hitungan menit, bukan hari'
  }
];

const faqs = [
  {
    question: 'Apakah ada biaya setup atau instalasi?',
    answer: 'Tidak ada biaya setup atau instalasi. Anda hanya membayar biaya berlangganan bulanan atau tahunan sesuai paket yang dipilih.'
  },
  {
    question: 'Bisakah saya upgrade atau downgrade paket kapan saja?',
    answer: 'Ya, Anda dapat mengubah paket kapan saja. Perubahan akan berlaku pada periode billing berikutnya.'
  },
  {
    question: 'Apakah data saya aman?',
    answer: 'Keamanan data adalah prioritas utama kami. Kami menggunakan enkripsi tingkat enterprise dan mematuhi standar keamanan internasional.'
  },
  {
    question: 'Bagaimana cara pembayaran?',
    answer: 'Kami menerima pembayaran melalui transfer bank, kartu kredit, dan e-wallet. Pembayaran dapat dilakukan bulanan atau tahunan.'
  }
];

export default function PricingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Harga Transparan
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Pilih Paket yang{' '}
              <span className="text-gradient-shopee-tiktok">
                Tepat
              </span>{' '}
              untuk Bisnis Anda
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Mulai dengan free trial 14 hari, lalu pilih paket yang sesuai dengan kebutuhan 
              dan skala bisnis Anda. Tidak ada kontrak jangka panjang.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <PricingTable />

      {/* Benefits Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Mengapa Memilih MarkasAI?"
            description="Keuntungan yang Anda dapatkan dengan berlangganan platform kami"
            centered
            className="mb-16"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-0 shadow-lg text-center">
                  <CardContent className="p-8 space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-shopee-tiktok rounded-2xl flex items-center justify-center shadow-lg glow-tiktok">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Pertanyaan yang Sering Diajukan"
            description="Jawaban untuk pertanyaan umum seputar harga dan paket kami"
            centered
            className="mb-16"
          />
          
          <div className="max-w-3xl mx-auto space-y-8">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8 space-y-4">
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-24 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-8 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Butuh Solusi Enterprise?
            </h2>
            <p className="text-xl opacity-90 leading-relaxed">
              Untuk perusahaan besar dengan kebutuhan khusus, kami menyediakan solusi 
              custom yang dapat disesuaikan dengan workflow dan sistem existing Anda.
            </p>
            <div className="space-y-4">
              <div className="flex flex-wrap justify-center gap-4 text-sm opacity-90">
                <span>✓ Custom AI Development</span>
                <span>✓ On-premise Deployment</span>
                <span>✓ Dedicated Support</span>
                <span>✓ SLA Guarantee</span>
              </div>
              <div className="pt-4">
                <button className="bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors">
                  Hubungi Tim Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
