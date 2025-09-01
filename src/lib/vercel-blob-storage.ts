// Vercel Blob Storage for persistent data
// Safe Edge Runtime compatible version
import { MediaFile, BlogPost, CaseStudy, Testimonial, Product } from '@/types';
import { getEnvironmentInfo } from './environment';

// Environment check
function isVercelProduction() {
  const env = getEnvironmentInfo();
  return env.isVercel && env.isProduction;
}

// For now, use JSON storage fallback since @vercel/blob isn't installed
import * as jsonStorage from './storage-json-only';

// Data storage keys
const STORAGE_KEYS = {
  BLOG_POSTS: 'data/blog-posts.json',
  CASE_STUDIES: 'data/case-studies.json',
  TESTIMONIALS: 'data/testimonials.json',
  PRODUCTS: 'data/products.json',
  MEDIA_FILES: 'data/media-files.json',
  SETTINGS: 'data/settings.json'
} as const;

// Generic storage functions
async function saveToBlob<T>(key: string, data: T[]): Promise<void> {
  if (!isVercelProduction()) {
    console.log('Development mode: using JSON storage');
    return;
  }

  try {
    // TODO: Implement actual Vercel Blob storage when @vercel/blob is available
    console.log(`📝 Would save to Vercel Blob: ${key}`);
    console.log('⚠️ Vercel Blob not implemented - data not persisted in production');
  } catch (error) {
    console.error(`❌ Failed to save to Vercel Blob: ${key}`, error);
    throw error;
  }
}

async function loadFromBlob<T>(key: string, fallback: T[] = []): Promise<T[]> {
  if (!isVercelProduction()) {
    // Development: gunakan JSON storage
    switch (key) {
      case STORAGE_KEYS.BLOG_POSTS:
        return (await jsonStorage.getBlogPosts()) as T[];
      case STORAGE_KEYS.CASE_STUDIES:
        return (await jsonStorage.getCaseStudies()) as T[];
      case STORAGE_KEYS.TESTIMONIALS:
        return (await jsonStorage.getTestimonials()) as T[];
      case STORAGE_KEYS.PRODUCTS:
        return (await jsonStorage.getProducts()) as T[];
      case STORAGE_KEYS.MEDIA_FILES:
        return [] as T[]; // Media files tidak disimpan di JSON
      default:
        return fallback;
    }
  }

  try {
    // TODO: Implement actual Vercel Blob loading when @vercel/blob is available
    console.log(`📖 Would load from Vercel Blob: ${key}`);
    return fallback;
  } catch (error) {
    console.error(`❌ Failed to load from Vercel Blob: ${key}`, error);
    return fallback;
  }
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  return loadFromBlob<BlogPost>(STORAGE_KEYS.BLOG_POSTS, []);
}

export async function saveBlogPosts(posts: BlogPost[]): Promise<void> {
  await saveToBlob(STORAGE_KEYS.BLOG_POSTS, posts);
}

export async function addBlogPost(post: BlogPost): Promise<BlogPost> {
  const posts = await getBlogPosts();
  const updatedPosts = [...posts, post];
  await saveBlogPosts(updatedPosts);
  return post;
}

export async function updateBlogPost(id: string, updateData: Partial<BlogPost>): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  const index = posts.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  const updatedPost = { ...posts[index], ...updateData };
  posts[index] = updatedPost;
  await saveBlogPosts(posts);
  return updatedPost;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const posts = await getBlogPosts();
  const filteredPosts = posts.filter(p => p.id !== id);
  
  if (filteredPosts.length === posts.length) return false;
  
  await saveBlogPosts(filteredPosts);
  return true;
}

// Case Studies
export async function getCaseStudies(): Promise<CaseStudy[]> {
  return loadFromBlob<CaseStudy>(STORAGE_KEYS.CASE_STUDIES, []);
}

export async function saveCaseStudies(caseStudies: CaseStudy[]): Promise<void> {
  await saveToBlob(STORAGE_KEYS.CASE_STUDIES, caseStudies);
}

export async function addCaseStudy(caseStudy: CaseStudy): Promise<CaseStudy> {
  const caseStudies = await getCaseStudies();
  const updated = [...caseStudies, caseStudy];
  await saveCaseStudies(updated);
  return caseStudy;
}

export async function updateCaseStudy(id: string, updateData: Partial<CaseStudy>): Promise<CaseStudy | null> {
  const caseStudies = await getCaseStudies();
  const index = caseStudies.findIndex(cs => cs.id === id);
  
  if (index === -1) return null;
  
  const updated = { ...caseStudies[index], ...updateData };
  caseStudies[index] = updated;
  await saveCaseStudies(caseStudies);
  return updated;
}

export async function deleteCaseStudy(id: string): Promise<boolean> {
  const caseStudies = await getCaseStudies();
  const filtered = caseStudies.filter(cs => cs.id !== id);
  
  if (filtered.length === caseStudies.length) return false;
  
  await saveCaseStudies(filtered);
  return true;
}

// Media Files
export async function getMediaFiles(): Promise<MediaFile[]> {
  return loadFromBlob<MediaFile>(STORAGE_KEYS.MEDIA_FILES, []);
}

export async function saveMediaFiles(files: MediaFile[]): Promise<void> {
  await saveToBlob(STORAGE_KEYS.MEDIA_FILES, files);
}

export async function addMediaFile(file: MediaFile): Promise<MediaFile> {
  const files = await getMediaFiles();
  const updated = [...files, file];
  await saveMediaFiles(updated);
  return file;
}

export async function deleteMediaFiles(ids: string[]): Promise<{ deletedFiles: string[]; errors: string[] }> {
  const files = await getMediaFiles();
  const deletedFiles: string[] = [];
  const errors: string[] = [];
  
  const filtered = files.filter(file => {
    if (ids.includes(file.id)) {
      deletedFiles.push(file.id);
      return false;
    }
    return true;
  });
  
  await saveMediaFiles(filtered);
  
  return { deletedFiles, errors };
}

// Products
export async function getProducts(): Promise<Product[]> {
  return loadFromBlob<Product>(STORAGE_KEYS.PRODUCTS, []);
}

export async function saveProducts(products: Product[]): Promise<void> {
  await saveToBlob(STORAGE_KEYS.PRODUCTS, products);
}

// Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  return loadFromBlob<Testimonial>(STORAGE_KEYS.TESTIMONIALS, []);
}

export async function saveTestimonials(testimonials: Testimonial[]): Promise<void> {
  await saveToBlob(STORAGE_KEYS.TESTIMONIALS, testimonials);
}

// File Upload untuk Media
export async function uploadMediaToBlob(file: File): Promise<MediaFile> {
  if (!isVercelProduction()) {
    throw new Error('File upload hanya tersedia di production Vercel');
  }

  try {
    // TODO: Implement actual Vercel Blob file upload when @vercel/blob is available
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    
    console.log(`📝 Would upload to Vercel Blob: ${filename}`);
    console.log('⚠️ Vercel Blob upload not implemented - returning mock data');

    // Create mock media file entry for now
    const mediaFile: MediaFile = {
      id: timestamp.toString(),
      name: filename,
      originalName: file.name,
      url: `/media/${filename}`, // Mock URL
      type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file',
      size: formatFileSize(file.size),
      uploadedAt: new Date().toLocaleDateString('id-ID'),
      dimensions: 'Auto-detected',
      deletable: true,
      isStatic: false
    };

    // Save to media files list
    await addMediaFile(mediaFile);

    return mediaFile;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

// Helper functions
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper functions untuk compatibility
export async function getBlogPostById(id: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find(p => p.id === id);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find(p => p.slug === slug && p.status === 'published');
}

export async function getCaseStudyById(id: string): Promise<CaseStudy | undefined> {
  const caseStudies = await getCaseStudies();
  return caseStudies.find(cs => cs.id === id);
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
  const caseStudies = await getCaseStudies();
  return caseStudies.find(cs => cs.slug === slug && cs.status === 'published');
}