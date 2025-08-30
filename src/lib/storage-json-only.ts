// Pure JSON storage - Using your existing JSON data files
import { Product, BlogPost, CaseStudy, Testimonial, MediaFile } from '@/types';

// Import your actual JSON data
let products: Product[] = [];
let blogPosts: BlogPost[] = [];
let caseStudies: CaseStudy[] = [];
let testimonials: Testimonial[] = [];
let mediaFiles: MediaFile[] = [];
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
      loadMediaFiles: () => fetch('/api/default-data/media').then(r => r.json()),
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
        loadMediaFiles: () => {
          const data = fs.readFileSync(path.join(process.cwd(), 'data/media.json'), 'utf8');
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
        loadMediaFiles: () => [],
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
      mediaFiles = await loader.loadMediaFiles();
      settings = await loader.loadSettings();
    } else {
      // Server-side sync loading
      products = loader.loadProducts();
      blogPosts = loader.loadBlogPosts();
      caseStudies = loader.loadCaseStudies();
      testimonials = loader.loadTestimonials();
      mediaFiles = loader.loadMediaFiles();
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

// Additional helper functions for CMS API routes
export async function getBlogPostById(id: string): Promise<BlogPost | undefined> {
  await initializeData();
  return (blogPosts || []).find(post => post.id === id);
}

export async function getCaseStudyById(id: string): Promise<CaseStudy | undefined> {
  await initializeData();
  return (caseStudies || []).find(cs => cs.id === id);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  await initializeData();
  return (products || []).find(product => product.id === id);
}

// Write functions - Note: These will only update in-memory data
// For actual persistence, you would need to implement file writing
export async function addBlogPost(post: BlogPost): Promise<BlogPost> {
  await initializeData();
  blogPosts = [...(blogPosts || []), post];
  return post;
}

export async function updateBlogPost(id: string, updateData: Partial<BlogPost>): Promise<BlogPost | null> {
  await initializeData();
  const index = (blogPosts || []).findIndex(post => post.id === id);
  if (index === -1) return null;
  
  const updatedPost = { ...blogPosts[index], ...updateData };
  blogPosts[index] = updatedPost;
  return updatedPost;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  await initializeData();
  const index = (blogPosts || []).findIndex(post => post.id === id);
  if (index === -1) return false;
  
  blogPosts.splice(index, 1);
  return true;
}

export async function addCaseStudy(caseStudy: CaseStudy): Promise<CaseStudy> {
  await initializeData();
  caseStudies = [...(caseStudies || []), caseStudy];
  return caseStudy;
}

export async function updateCaseStudy(id: string, updateData: Partial<CaseStudy>): Promise<CaseStudy | null> {
  await initializeData();
  const index = (caseStudies || []).findIndex(cs => cs.id === id);
  if (index === -1) return null;
  
  const updatedCaseStudy = { ...caseStudies[index], ...updateData };
  caseStudies[index] = updatedCaseStudy;
  return updatedCaseStudy;
}

export async function deleteCaseStudy(id: string): Promise<boolean> {
  await initializeData();
  const index = (caseStudies || []).findIndex(cs => cs.id === id);
  if (index === -1) return false;
  
  caseStudies.splice(index, 1);
  return true;
}

export async function addProduct(product: Product): Promise<Product> {
  await initializeData();
  products = [...(products || []), product];
  return product;
}

export async function updateProduct(id: string, updateData: Partial<Product>): Promise<Product | null> {
  await initializeData();
  const index = (products || []).findIndex(product => product.id === id);
  if (index === -1) return null;
  
  const updatedProduct = { ...products[index], ...updateData };
  products[index] = updatedProduct;
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await initializeData();
  const index = (products || []).findIndex(product => product.id === id);
  if (index === -1) return false;
  
  products.splice(index, 1);
  return true;
}

export async function addTestimonial(testimonial: Testimonial): Promise<Testimonial> {
  await initializeData();
  testimonials = [...(testimonials || []), testimonial];
  return testimonial;
}

export async function updateTestimonial(id: string, updateData: Partial<Testimonial>): Promise<Testimonial | null> {
  await initializeData();
  const index = (testimonials || []).findIndex(t => t.id === id);
  if (index === -1) return null;
  
  const updatedTestimonial = { ...testimonials[index], ...updateData };
  testimonials[index] = updatedTestimonial;
  return updatedTestimonial;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  await initializeData();
  const index = (testimonials || []).findIndex(t => t.id === id);
  if (index === -1) return false;
  
  testimonials.splice(index, 1);
  return true;
}

// Media functions
export async function getMediaFiles(): Promise<MediaFile[]> {
  await initializeData();
  return mediaFiles || [];
}

export async function getMediaFileById(id: string): Promise<MediaFile | undefined> {
  await initializeData();
  return (mediaFiles || []).find(file => file.id === id);
}

export async function addMediaFile(file: MediaFile): Promise<MediaFile> {
  await initializeData();
  mediaFiles = [...(mediaFiles || []), file];
  return file;
}

export async function updateMediaFile(id: string, updateData: Partial<MediaFile>): Promise<MediaFile | null> {
  await initializeData();
  const index = (mediaFiles || []).findIndex(file => file.id === id);
  if (index === -1) return null;
  
  const updatedFile = { ...mediaFiles[index], ...updateData };
  mediaFiles[index] = updatedFile;
  return updatedFile;
}

export async function deleteMediaFile(id: string): Promise<boolean> {
  await initializeData();
  const index = (mediaFiles || []).findIndex(file => file.id === id);
  if (index === -1) return false;
  
  mediaFiles.splice(index, 1);
  return true;
}

export async function deleteMultipleMediaFiles(ids: string[]): Promise<{ deletedFiles: string[]; errors: string[] }> {
  await initializeData();
  const deletedFiles: string[] = [];
  const errors: string[] = [];
  
  for (const id of ids) {
    const index = (mediaFiles || []).findIndex(file => file.id === id);
    if (index !== -1) {
      mediaFiles.splice(index, 1);
      deletedFiles.push(id);
    } else {
      errors.push(`File not found: ${id}`);
    }
  }
  
  return { deletedFiles, errors };
}