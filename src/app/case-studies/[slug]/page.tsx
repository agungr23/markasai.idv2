import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCaseStudiesFromStorage, getCaseStudyBySlugFromStorage } from '@/lib/case-study-storage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Building, ArrowLeft, TrendingUp, Users, Clock } from 'lucide-react';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const caseStudies = await getCaseStudiesFromStorage();
  return caseStudies.map((caseStudy) => ({
    slug: caseStudy.slug,
  }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlugFromStorage(slug);

  if (!caseStudy) {
    return {
      title: 'Case Study Tidak Ditemukan',
    };
  }

  return {
    title: caseStudy.seo.title,
    description: caseStudy.seo.description,
    keywords: caseStudy.seo.keywords,
    openGraph: {
      title: caseStudy.seo.title,
      description: caseStudy.seo.description,
      images: caseStudy.logo ? [caseStudy.logo] : [],
      type: 'article',
      publishedTime: caseStudy.publishedAt,
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlugFromStorage(slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <>
      {/* Back Navigation */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/case-studies">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Kembali ke Case Studies
            </Link>
          </Button>
        </div>
      </section>

      {/* Case Study Header */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Client Info */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative w-20 h-20 bg-white rounded-2xl shadow-lg overflow-hidden p-4">
                {caseStudy.logo ? (
                  <Image
                    src={caseStudy.logo}
                    alt={caseStudy.client}
                    fill
                    className="object-contain"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-xs">Logo</span>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{caseStudy.client}</h2>
                <Badge variant="secondary" className="mt-2">
                  {caseStudy.industry}
                </Badge>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {caseStudy.title}
            </h1>

            {/* Summary */}
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {caseStudy.summary}
            </p>

            {/* Meta Info */}
            <div className="flex items-center space-x-6 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>{caseStudy.industry}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(caseStudy.publishedAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Hasil yang Dicapai</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {caseStudy.metrics.map((metric, index) => {
                const icons = [TrendingUp, Users, Clock];
                const Icon = icons[index % icons.length];
                
                return (
                  <Card key={index} className="border-0 shadow-lg text-center">
                    <CardContent className="p-8 space-y-4">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {metric.value}
                      </div>
                      <h3 className="text-xl font-semibold">{metric.label}</h3>
                      <p className="text-muted-foreground text-sm">
                        {metric.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {/* Convert markdown-like content to HTML */}
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: caseStudy.body
                    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
                    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
                    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-4 mb-2">$1</h3>')
                    .replace(/^\* (.*$)/gim, '<li class="mb-1">$1</li>')
                    .replace(/^- (.*$)/gim, '<li class="mb-1">$1</li>')
                    .replace(/\n\n/g, '</p><p class="mb-4">')
                    .replace(/^(?!<[h|l])/gm, '<p class="mb-4">')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic text-lg my-6">$1</blockquote>')
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Timeline Implementasi</h2>
            
            <div className="space-y-8">
              {[
                {
                  phase: 'Bulan 1-2',
                  title: 'Foundation',
                  description: 'Setup AI tools, training tim, dan initial optimization',
                  results: ['Setup lengkap', 'Tim terlatih', 'Optimasi awal']
                },
                {
                  phase: 'Bulan 3-4',
                  title: 'Growth',
                  description: 'Implementasi penuh dan optimasi berkelanjutan',
                  results: ['150% peningkatan conversion', '80% pengurangan response time', '200% peningkatan engagement']
                },
                {
                  phase: 'Bulan 5-6',
                  title: 'Scale',
                  description: 'Scaling dan fine-tuning untuk hasil maksimal',
                  results: ['300% peningkatan penjualan', '95% customer satisfaction', '50% pengurangan operational cost']
                }
              ].map((timeline, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-xl font-bold">{timeline.title}</h3>
                          <Badge variant="outline">{timeline.phase}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">{timeline.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {timeline.results.map((result, resultIndex) => (
                            <div key={resultIndex} className="text-sm bg-muted/50 rounded px-3 py-2">
                              ✓ {result}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Siap Mencapai Hasil Serupa?
            </h2>
            <p className="text-xl opacity-90">
              Konsultasikan kebutuhan AI bisnis Anda dengan tim ahli kami dan mulai transformasi digital yang menguntungkan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="/contact">
                  Konsultasi Gratis
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white btn-force-text-hover">
                <Link href="/products">
                  Lihat Solusi AI
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
