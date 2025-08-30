import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostsFromStorage, getBlogPostBySlugFromStorage } from '@/lib/blog-storage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const blogPosts = await getBlogPostsFromStorage();
  // Only generate static params for published posts
  const publishedPosts = blogPosts.filter(post => post.status === 'published');
  return publishedPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlugFromStorage(slug);

  if (!post || post.status !== 'published') {
    return {
      title: 'Artikel Tidak Ditemukan',
    };
  }

  return {
    title: post.seo.title,
    description: post.seo.description,
    keywords: post.seo.keywords,
    openGraph: {
      title: post.seo.title,
      description: post.seo.description,
      images: [post.cover],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo.title,
      description: post.seo.description,
      images: [post.cover],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlugFromStorage(slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  // Get related posts (excluding current post, only published)
  const allPosts = await getBlogPostsFromStorage();
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.status === 'published' && p.tags.some(tag => post.tags.includes(tag)))
    .slice(0, 3);

  return (
    <>
      {/* Back Navigation */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/blog">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Kembali ke Blog
            </Link>
          </Button>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="flex items-center space-x-6 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{post.author.name}</div>
                    <div className="text-sm">{post.author.bio}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.publishedAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 bg-gray-100">
              <Image
                src={post.cover}
                alt={post.title}
                fill
                className="object-contain bg-white"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {/* Convert markdown-like content to HTML */}
              <div
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    let html = post.body;

                    // Convert headers (must be done first)
                    html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-8 mb-4 text-gray-900">$1</h3>');
                    html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-10 mb-6 text-gray-900">$1</h2>');
                    html = html.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-12 mb-8 text-gray-900">$1</h1>');

                    // Convert bold and italic
                    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
                    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

                    // Convert lists
                    html = html.replace(/^- (.*$)/gm, '<div class="flex items-start mb-2"><span class="mr-2 text-primary">•</span><span>$1</span></div>');

                    // Split into paragraphs and process
                    const paragraphs = html.split('\n\n');
                    html = paragraphs.map(p => {
                      p = p.trim();
                      if (!p) return '';
                      // Don't wrap headers or list items in paragraphs
                      if (p.startsWith('<h') || p.startsWith('<div class="flex')) {
                        return p;
                      }
                      // Replace single line breaks with <br> within paragraphs
                      p = p.replace(/\n/g, '<br>');
                      return `<p class="mb-4 text-gray-700 leading-relaxed">${p}</p>`;
                    }).join('\n');

                    return html;
                  })()
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-16">Artikel Terkait</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <div className="relative aspect-video bg-gray-100">
                      <Image
                        src={relatedPost.cover}
                        alt={relatedPost.title}
                        fill
                        className="object-contain bg-white transition-transform duration-300 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    
                    <CardContent className="p-6 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {relatedPost.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <h3 className="text-lg font-bold leading-tight line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href={`/blog/${relatedPost.slug}`}>
                          Baca Artikel
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Siap Menerapkan AI untuk Bisnis Anda?
            </h2>
            <p className="text-xl opacity-90">
              Konsultasikan kebutuhan AI bisnis Anda dengan tim ahli kami dan dapatkan solusi yang tepat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="/contact">
                  Konsultasi Gratis
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white btn-force-text-hover">
                <Link href="/products">
                  Lihat Produk AI
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
