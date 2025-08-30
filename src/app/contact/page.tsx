import { Metadata } from 'next';
import { LeadForm } from '@/components/forms/lead-form';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hubungi Kami - MarkasAI',
  description: 'Hubungi tim MarkasAI untuk konsultasi gratis, demo produk, atau pertanyaan seputar solusi AI untuk bisnis Anda.',
  keywords: ['kontak markasai', 'hubungi kami', 'konsultasi ai', 'demo produk'],
};

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@markasai.id',
    description: 'Kirim email untuk pertanyaan umum'
  },
  {
    icon: Phone,
    title: 'WhatsApp',
    value: '+62 812-3456-7890',
    description: 'Chat langsung dengan tim support'
  },
  {
    icon: MapPin,
    title: 'Alamat',
    value: 'Jakarta, Indonesia',
    description: 'Kantor pusat kami'
  },
  {
    icon: Clock,
    title: 'Jam Operasional',
    value: 'Senin - Jumat, 09:00 - 18:00 WIB',
    description: 'Support 24/7 untuk klien premium'
  }
];

const reasons = [
  {
    title: 'Konsultasi Gratis',
    description: 'Dapatkan konsultasi gratis untuk menentukan solusi AI yang tepat untuk bisnis Anda'
  },
  {
    title: 'Demo Produk',
    description: 'Lihat langsung bagaimana produk AI kami dapat membantu mengoptimalkan operasional bisnis'
  },
  {
    title: 'Custom Solution',
    description: 'Butuh solusi khusus? Tim kami siap mengembangkan AI sesuai kebutuhan spesifik Anda'
  },
  {
    title: 'Partnership',
    description: 'Tertarik menjadi partner atau reseller? Mari diskusikan peluang kerjasama'
  }
];

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Hubungi Kami
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Mari{' '}
              <span className="text-gradient-shopee-tiktok">
                Diskusikan
              </span>{' '}
              Kebutuhan AI Bisnis Anda
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Tim ahli kami siap membantu Anda menemukan solusi AI yang tepat untuk 
              mengoptimalkan bisnis dan meningkatkan produktivitas.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <LeadForm 
                title="Mulai Percakapan"
                description="Isi form di bawah ini dan tim kami akan menghubungi Anda dalam 24 jam untuk konsultasi gratis."
                source="contact-page"
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Informasi Kontak</h2>
                <p className="text-muted-foreground mb-8">
                  Pilih cara yang paling nyaman untuk menghubungi kami. Tim support kami 
                  siap membantu Anda dengan respon cepat dan solusi terbaik.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <Card key={index} className="border-0 shadow-lg">
                      <CardContent className="p-6 space-y-4">
                        <div className="w-12 h-12 bg-gradient-shopee-tiktok rounded-lg flex items-center justify-center shadow-md glow-shopee">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{info.title}</h3>
                          <p className="text-sm font-medium text-primary">{info.value}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {info.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reasons to Contact */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Mengapa Harus Menghubungi Kami?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Berbagai alasan mengapa ribuan bisnis mempercayakan kebutuhan AI mereka kepada kami
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reasons.map((reason, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8 space-y-4">
                  <h3 className="text-xl font-semibold">{reason.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {reason.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Quick */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Pertanyaan Cepat</h2>
            <p className="text-muted-foreground">
              Jawaban singkat untuk pertanyaan yang sering diajukan
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold">Berapa lama proses implementasi?</h3>
                <p className="text-sm text-muted-foreground">
                  Implementasi dasar dapat dilakukan dalam 1-3 hari kerja. Untuk solusi custom, 
                  biasanya membutuhkan 1-4 minggu tergantung kompleksitas.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold">Apakah ada training untuk tim?</h3>
                <p className="text-sm text-muted-foreground">
                  Ya, kami menyediakan training komprehensif untuk tim Anda, termasuk 
                  dokumentasi lengkap dan session onboarding.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold">Bagaimana dengan keamanan data?</h3>
                <p className="text-sm text-muted-foreground">
                  Kami menggunakan enkripsi tingkat enterprise dan mematuhi standar 
                  keamanan internasional untuk melindungi data bisnis Anda.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold">Apakah bisa integrasi dengan sistem existing?</h3>
                <p className="text-sm text-muted-foreground">
                  Tentu! Produk kami dirancang untuk mudah diintegrasikan dengan 
                  berbagai sistem dan tools bisnis yang sudah Anda gunakan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
