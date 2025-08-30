// Pure JSON storage - Using your existing JSON data files
import { Product, BlogPost, CaseStudy, Testimonial } from '@/types';

// Import your actual JSON data
let products: Product[] = [];
let blogPosts: BlogPost[] = [];
let caseStudies: CaseStudy[] = [];
let testimonials: Testimonial[] = [];
let settings: Record<string, unknown> = {};

// Load data function for client-side or edge runtime
function loadData() {
  if (typeof window !== 'undefined') {
    // Client-side: Use fetch API
    return {
      loadProducts: () => fetch('/data/products.json').then(r => r.json()),
      loadBlogPosts: () => fetch('/api/default-data/blog-posts').then(r => r.json()),
      loadCaseStudies: () => fetch('/api/default-data/case-studies').then(r => r.json()),
      loadTestimonials: () => fetch('/api/default-data/testimonials').then(r => r.json()),
      loadSettings: () => fetch('/api/default-data/settings').then(r => r.json())
    };
  } else {
    // Server-side: Use dynamic imports for Edge Runtime compatibility
    try {
      // Using Node.js modules only in server environment
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const fs = require('fs');
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const path = require('path');
      
      return {
        loadProducts: () => {
          const data = fs.readFileSync(path.join(process.cwd(), 'public/data/products.json'), 'utf8');
          return JSON.parse(data);
        },
        loadBlogPosts: () => {
          const data = fs.readFileSync(path.join(process.cwd(), 'data/blog-posts.json'), 'utf8');
          return JSON.parse(data);
        },
        loadCaseStudies: () => {
          const data = fs.readFileSync(path.join(process.cwd(), 'data/case-studies.json'), 'utf8');
          return JSON.parse(data);
        },
        loadTestimonials: () => {
          const data = fs.readFileSync(path.join(process.cwd(), 'data/testimonials.json'), 'utf8');
          return JSON.parse(data);
        },
        loadSettings: () => {
          const data = fs.readFileSync(path.join(process.cwd(), 'data/settings.json'), 'utf8');
          return JSON.parse(data);
        }
      };
    } catch {
      // Fallback for edge runtime
      return {
        loadProducts: () => [],
        loadBlogPosts: () => [],
        loadCaseStudies: () => [],
        loadTestimonials: () => [],
        loadSettings: () => ({})
      };
    }
  }
}

// Initialize data
let dataLoaded = false;
async function initializeData() {
  if (dataLoaded) return;
  
  const loader = loadData();
  
  try {
    if (typeof window !== 'undefined') {
      // Client-side async loading
      products = await loader.loadProducts();
      blogPosts = await loader.loadBlogPosts();
      caseStudies = await loader.loadCaseStudies();
      testimonials = await loader.loadTestimonials();
      settings = await loader.loadSettings();
    } else {
      // Server-side sync loading
      products = loader.loadProducts();
      blogPosts = loader.loadBlogPosts();
      caseStudies = loader.loadCaseStudies();
      testimonials = loader.loadTestimonials();
      settings = loader.loadSettings();
    }
    dataLoaded = true;
  } catch (err) {
    console.warn('Failed to load JSON data, using empty defaults:', err);
    dataLoaded = true; // Mark as loaded to prevent retry loops
  }
}

// Async functions to ensure data is loaded
export async function getProducts(): Promise<Product[]> {
  await initializeData();
  return products || [];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  await initializeData();
  return (blogPosts || []).filter(post => post.status === 'published');
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  await initializeData();
  return (caseStudies || []).filter(cs => cs.status === 'published');
}

export async function getTestimonials(): Promise<Testimonial[]> {
  await initializeData();
  return testimonials || [];
}

// Individual getters with async data loading
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  await initializeData();
  return (products || []).find(product => product.slug === slug);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  await initializeData();
  return (blogPosts || []).find(post => post.slug === slug && post.status === 'published');
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
  await initializeData();
  return (caseStudies || []).find(cs => cs.slug === slug && cs.status === 'published');
}

// Categories and filtering with async data loading
export async function getProductCategories(): Promise<string[]> {
  await initializeData();
  const categories = [...new Set((products || []).map(product => product.category))];
  return categories.sort();
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  await initializeData();
  return (products || []).filter(product => product.category === category);
}

export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  await initializeData();
  return (blogPosts || []).filter(post => 
    post.status === 'published' && 
    post.tags && post.tags.includes(tag)
  );
}

// Featured content with async data loading
export async function getFeaturedProducts(): Promise<Product[]> {
  await initializeData();
  return (products || []).filter(product => product.isFeatured === true).slice(0, 3);
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  await initializeData();
  return (blogPosts || [])
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);
}

export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  await initializeData();
  return (caseStudies || [])
    .filter(cs => cs.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  await initializeData();
  return (testimonials || []).filter(testimonial => testimonial.featured).slice(0, 6);
}

// Settings from your JSON file
export async function getSettings() {
  await initializeData();
  return settings || {
    siteName: 'MarkasAI',
    siteDescription: 'AI untuk Bisnis yang Lebih Efektif & Efisien',
    contactEmail: 'hello@markasai.id',
    phone: '+62 812-3456-7890',
    address: 'Jakarta, Indonesia'
  };
}