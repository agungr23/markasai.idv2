// Pure JSON storage - No complex adapters, Edge Runtime compatible
import { Product, BlogPost, CaseStudy, Testimonial } from '@/types';

// Import JSON data directly - build time resolution
import productsData from '../../data/products.json';
import blogPostsData from '../../data/blog-posts.json';
import caseStudiesData from '../../data/case-studies.json';
import testimonialsData from '../../data/testimonials.json';

// Type assertion untuk memastikan type safety
const products = productsData as Product[];
const blogPosts = blogPostsData as BlogPost[];
const caseStudies = caseStudiesData as CaseStudy[];
const testimonials = testimonialsData as Testimonial[];

// Simple, fast, no async needed
export function getProducts(): Product[] {
  return products;
}

export function getBlogPosts(): BlogPost[] {
  return blogPosts.filter(post => post.status === 'published');
}

export function getCaseStudies(): CaseStudy[] {
  return caseStudies.filter(cs => cs.status === 'published');
}

export function getTestimonials(): Testimonial[] {
  return testimonials;
}

// Individual getters
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(product => product.slug === slug);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug && post.status === 'published');
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find(cs => cs.slug === slug && cs.status === 'published');
}

// Categories and filtering
export function getProductCategories(): string[] {
  const categories = [...new Set(products.map(product => product.category))];
  return categories.sort();
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category);
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => 
    post.status === 'published' && 
    post.tags.includes(tag)
  );
}

// Featured content
export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.featured).slice(0, 3);
}

export function getFeaturedBlogPosts(): BlogPost[] {
  return blogPosts
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies
    .filter(cs => cs.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);
}

export function getFeaturedTestimonials(): Testimonial[] {
  return testimonials.filter(testimonial => testimonial.featured).slice(0, 6);
}

// Default settings
export function getSettings() {
  return {
    siteTitle: 'MarkasAI.ID - Platform AI Terdepan Indonesia',
    siteDescription: 'Solusi AI terdepan untuk transformasi digital bisnis Anda',
    contactEmail: 'hello@markasai.id',
    phone: '+62 812-3456-7890',
    address: 'Jakarta, Indonesia',
    socialMedia: {
      instagram: '@markasai.id',
      linkedin: 'MarkasAI',
      youtube: '@MarkasAI',
      twitter: '@markasai_id'
    },
    businessHours: {
      weekdays: '09:00 - 18:00 WIB',
      saturday: '09:00 - 15:00 WIB',
      sunday: 'Tutup'
    }
  };
}