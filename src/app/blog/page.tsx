'use client';

import { useState, useEffect } from 'react';
import { SectionTitle } from '@/components/ui/section-title';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { getBlogPosts } from '@/lib/storage-json-only';

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data dari JSON langsung - sangat cepat, no API call needed
    const posts = getBlogPosts();
    setBlogPosts(posts);
    setLoading(false);
  }, []);

  const categories = [
    { name: 'Semua', count: blogPosts.length },
    { name: 'AI', count: blogPosts.filter(post => post.tags.includes('AI')).length },
    { name: 'Bisnis', count: blogPosts.filter(post => post.tags.includes('Bisnis')).length },
    { name: 'Marketing Digital', count: blogPosts.filter(post => post.tags.includes('Marketing Digital')).length },
    { name: 'UMKM', count: blogPosts.filter(post => post.tags.includes('UMKM')).length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading blog posts...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Blog MarkasAI
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Tips & Insights{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI untuk Bisnis
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Pelajari strategi terbaru, tips praktis, dan insights dari para ahli AI 
              untuk mengoptimalkan bisnis Anda di era digital.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                className="rounded-full"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {blogPosts.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle
              subtitle="Artikel Terbaru"
              title="Featured Post"
              centered
              className="mb-16"
            />
            
            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative aspect-video lg:aspect-[4/3] bg-gray-100">
                  <Image
                    src={blogPosts[0].cover}
                    alt={blogPosts[0].title}
                    fill
                    className="object-contain bg-white"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <CardContent className="p-12 flex flex-col justify-center space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {blogPosts[0].tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <h2 className="text-3xl font-bold leading-tight">
                    {blogPosts[0].title}
                  </h2>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {blogPosts[0].excerpt}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{blogPosts[0].author.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(blogPosts[0].publishedAt).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  
                  <Button asChild className="w-fit">
                    <Link href={`/blog/${blogPosts[0].slug}`}>
                      Baca Selengkapnya
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Semua Artikel"
            description="Jelajahi koleksi lengkap artikel kami tentang AI dan bisnis"
            centered
            className="mb-16"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="relative aspect-video bg-gray-100">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    className="object-contain bg-white transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold leading-tight line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.publishedAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/blog/${post.slug}`}>
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

      {/* Newsletter CTA */}
      <section className="py-24 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Jangan Lewatkan Update Terbaru
            </h2>
            <p className="text-xl opacity-90">
              Dapatkan artikel terbaru, tips AI, dan insights bisnis langsung ke email Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email Anda"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <Button variant="secondary" className="px-8 py-3">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
