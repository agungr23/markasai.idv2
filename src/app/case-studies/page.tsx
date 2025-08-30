'use client';

import { SectionTitle } from '@/components/ui/section-title';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCaseStudies } from '@/hooks/useCaseStudies';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Building, ArrowRight, TrendingUp } from 'lucide-react';

export default function CaseStudiesPage() {
  const { caseStudies, loading } = useCaseStudies();

  // Filter only published case studies
  const publishedCaseStudies = caseStudies.filter(cs => cs.status === 'published');

  const industries = [
    { name: 'Semua', count: publishedCaseStudies.length },
    { name: 'E-commerce', count: publishedCaseStudies.filter(cs => cs.industry === 'E-commerce').length },
    { name: 'Manufacturing', count: publishedCaseStudies.filter(cs => cs.industry === 'Manufacturing').length },
    { name: 'Healthcare', count: publishedCaseStudies.filter(cs => cs.industry === 'Healthcare').length },
    { name: 'Logistics', count: publishedCaseStudies.filter(cs => cs.industry === 'Logistics').length },
  ];
  return (
    <>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Success Stories
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Kisah Sukses{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Transformasi AI
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Pelajari bagaimana berbagai bisnis berhasil mengimplementasikan AI dan 
              meningkatkan performa mereka dengan solusi MarkasAI.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '1000+', label: 'Bisnis Terlayani' },
              { number: '300%', label: 'Rata-rata Peningkatan ROI' },
              { number: '95%', label: 'Tingkat Kepuasan Klien' },
              { number: '24/7', label: 'Support Berkelanjutan' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Filter */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {industries.map((industry, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                className="rounded-full"
              >
                {industry.name} ({industry.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <span className="ml-4 text-lg text-gray-600">Memuat case studies...</span>
            </div>
          </div>
        </section>
      )}

      {/* Featured Case Study */}
      {!loading && publishedCaseStudies.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle
              subtitle="Featured Case Study"
              title="Transformasi Terdepan"
              centered
              className="mb-16"
            />
            
            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <CardContent className="p-12 flex flex-col justify-center space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden">
                      {publishedCaseStudies[0].logo ? (
                        <Image
                          src={publishedCaseStudies[0].logo}
                          alt={publishedCaseStudies[0].client}
                          fill
                          className="object-contain p-2"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-xs">Logo</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{publishedCaseStudies[0].client}</h3>
                      <Badge variant="secondary">{publishedCaseStudies[0].industry}</Badge>
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold leading-tight">
                    {publishedCaseStudies[0].title}
                  </h2>

                  <p className="text-muted-foreground leading-relaxed">
                    {publishedCaseStudies[0].summary}
                  </p>
                  
                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    {publishedCaseStudies[0].metrics.map((metric, index) => (
                      <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {metric.value}
                        </div>
                        <div className="text-sm font-medium">{metric.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {metric.description}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4" />
                      <span>{publishedCaseStudies[0].industry}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(publishedCaseStudies[0].publishedAt).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  
                  <Button asChild className="w-fit">
                    <Link href={`/case-studies/${publishedCaseStudies[0].slug}`}>
                      Baca Case Study Lengkap
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
                
                <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 p-12 flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <TrendingUp className="w-24 h-24 text-primary mx-auto" />
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-primary">300%</div>
                      <div className="text-lg font-semibold">Peningkatan Penjualan</div>
                      <div className="text-muted-foreground">dalam 6 bulan pertama</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* All Case Studies */}
      {!loading && (
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle
              title="Semua Case Studies"
              description="Jelajahi berbagai kisah sukses implementasi AI di berbagai industri"
              centered
              className="mb-16"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedCaseStudies.map((caseStudy) => (
              <Card key={caseStudy.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative w-12 h-12 bg-muted rounded-lg overflow-hidden">
                      {caseStudy.logo ? (
                        <Image
                          src={caseStudy.logo}
                          alt={caseStudy.client}
                          fill
                          className="object-contain p-2"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-xs">Logo</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold">{caseStudy.client}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {caseStudy.industry}
                      </Badge>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-bold leading-tight line-clamp-2">
                    {caseStudy.title}
                  </h4>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {caseStudy.summary}
                  </p>
                  
                  {/* Key Metric */}
                  {caseStudy.metrics.length > 0 && (
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {caseStudy.metrics[0].value}
                      </div>
                      <div className="text-sm font-medium">
                        {caseStudy.metrics[0].label}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(caseStudy.publishedAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/case-studies/${caseStudy.slug}`}>
                        Baca
                        <ArrowRight className="ml-1 w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Siap Menjadi Success Story Berikutnya?
            </h2>
            <p className="text-xl opacity-90">
              Bergabung dengan ribuan bisnis yang telah merasakan transformasi dengan AI kami.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="/contact">
                  Mulai Transformasi
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
