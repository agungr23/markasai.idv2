import { Metadata } from 'next';
import { SectionTitle } from '@/components/ui/section-title';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Target, Eye, Users, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tentang MarkasAI - Misi & Visi Perusahaan',
  description: 'Pelajari lebih lanjut tentang MarkasAI, visi misi kami, dan komitmen untuk memberdayakan bisnis dengan teknologi AI.',
  keywords: ['tentang markasai', 'visi misi', 'perusahaan ai', 'tim markasai'],
};

const stats = [
  {
    number: '1000+',
    label: 'Bisnis Terlayani',
    description: 'UMKM dan perusahaan yang telah menggunakan solusi AI kami'
  },
  {
    number: '50+',
    label: 'AI Tools',
    description: 'Berbagai tools AI yang tersedia dalam platform kami'
  },
  {
    number: '95%',
    label: 'Kepuasan Klien',
    description: 'Rating kepuasan dari pengguna aktif platform kami'
  },
  {
    number: '24/7',
    label: 'Support',
    description: 'Tim support yang siap membantu kapan saja'
  }
];

const values = [
  {
    icon: Target,
    title: 'Fokus pada Hasil',
    description: 'Setiap solusi AI yang kami kembangkan dirancang untuk memberikan hasil nyata dan terukur bagi bisnis klien.'
  },
  {
    icon: Users,
    title: 'Mudah Digunakan',
    description: 'Kami percaya teknologi AI harus mudah diakses oleh semua orang, tanpa memerlukan keahlian teknis yang mendalam.'
  },
  {
    icon: TrendingUp,
    title: 'Inovasi Berkelanjutan',
    description: 'Kami terus mengembangkan dan memperbarui produk mengikuti perkembangan teknologi AI terdepan.'
  },
  {
    icon: Eye,
    title: 'Transparansi',
    description: 'Kami berkomitmen untuk transparan dalam setiap proses, dari pricing hingga cara kerja AI kami.'
  }
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Tentang MarkasAI
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Memberdayakan Bisnis dengan{' '}
              <span className="text-gradient-shopee-tiktok">
                Teknologi AI
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              MarkasAI adalah software house & platform AI yang membantu UMKM, entrepreneur, 
              dan perusahaan meningkatkan efektivitas & efisiensi kerja melalui solusi AI yang praktis dan mudah digunakan.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Mission */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 space-y-6">
                <div className="w-16 h-16 bg-gradient-shopee-tiktok rounded-2xl flex items-center justify-center shadow-lg glow-shopee">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold">Misi Kami</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Menjadikan teknologi AI mudah diakses dan dimanfaatkan oleh semua kalangan bisnis, 
                  dari UMKM hingga perusahaan besar, untuk meningkatkan produktivitas dan daya saing 
                  di era digital.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 space-y-6">
                <div className="w-16 h-16 bg-gradient-tiktok-shopee rounded-2xl flex items-center justify-center shadow-lg glow-tiktok">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold">Visi Kami</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Menjadi platform AI terdepan di Indonesia yang memberdayakan jutaan bisnis 
                  untuk berkembang dan bersaing secara global melalui implementasi teknologi 
                  artificial intelligence yang cerdas dan efektif.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Pencapaian Kami"
            description="Angka-angka yang menunjukkan komitmen kami dalam melayani bisnis Indonesia"
            centered
            className="mb-16"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="text-4xl font-bold text-gradient-shopee-tiktok">
                    {stat.number}
                  </div>
                  <h3 className="text-xl font-semibold">{stat.label}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Nilai-Nilai Kami"
            description="Prinsip-prinsip yang memandu setiap langkah kami dalam mengembangkan solusi AI"
            centered
            className="mb-16"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8 space-y-6">
                    <div className="w-16 h-16 bg-gradient-shopee-tiktok rounded-2xl flex items-center justify-center shadow-lg glow-shopee">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Movement Statement */}
      <section className="py-24 bg-gradient-animated relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold drop-shadow-lg shimmer">
              &ldquo;AI bukan masa depan—AI adalah hari ini&rdquo;
            </h2>
            <p className="text-xl opacity-90 leading-relaxed drop-shadow-md">
              AI bisa jadi ancaman, tetapi juga peluang besar. MarkasAI memastikan bisnis
              berada di sisi yang benar: memakai AI untuk tumbuh, bukan tergeser.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-white text-markasai-blue hover:bg-gray-100 transition-colors shadow-lg hover-lift font-semibold">
                <Link href="/products">
                  Lihat Solusi Kami
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white transition-colors backdrop-blur-sm hover-lift btn-force-text-hover">
                <Link href="/contact">
                  Hubungi Kami
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
