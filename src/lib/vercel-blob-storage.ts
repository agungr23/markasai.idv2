// Vercel Blob Storage for persistent data
// Production-ready implementation with fallback to JSON storage in development
import { MediaFile, BlogPost, CaseStudy, Testimonial, Product } from '@/types';
import { getEnvironmentInfo } from './environment';

// Type definitions for Vercel Blob functions
type BlobPutOptions = {
  access: 'public' | 'private';
  contentType?: string;
};

type BlobListOptions = {
  prefix?: string;
};

type BlobListResult = {
  blobs: Array<{ url: string; pathname: string }>;
};

// Conditional import for Vercel Blob to avoid build errors in development
let put: ((pathname: string, body: File | string, options: BlobPutOptions) => Promise<{ url: string }>) | undefined;
let list: ((options?: BlobListOptions) => Promise<BlobListResult>) | undefined;
let del: ((url: string) => Promise<void>) | undefined;

if (typeof window === 'undefined') {
  // Server-side only imports
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const blobModule = require('@vercel/blob');
    put = blobModule.put;
    list = blobModule.list;
    del = blobModule.del;
  } catch {
    // Fallback if @vercel/blob is not available
    console.log('⚠️ @vercel/blob not available, using fallback storage');
  }
}

// Environment check
function isVercelProduction() {
  const env = getEnvironmentInfo();
  return env.isVercel && env.isProduction && put && list && del;
}

// Check if blob token is available
function hasBlobToken() {
  const env = getEnvironmentInfo();
  if (!env.isProduction) return false;
  
  // Check for blob token in environment
  try {
    const hasProcess = typeof globalThis !== 'undefined' && 'process' in globalThis;
    if (!hasProcess) return false;
    
    const processEnv = (globalThis as { process: { env: Record<string, string | undefined> } }).process.env;
    return !!processEnv.BLOB_READ_WRITE_TOKEN;
  } catch {
    return false;
  }
}

// Fallback to JSON storage in development
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
  if (!isVercelProduction() || !put) {
    console.log('Development mode: using JSON storage');
    return;
  }

  try {
    const jsonData = JSON.stringify(data, null, 2);
    await put(key, jsonData, {
      access: 'public',
      contentType: 'application/json'
    });
    console.log(`✅ Saved to Vercel Blob: ${key}`);
  } catch (error) {
    console.error(`❌ Failed to save to Vercel Blob: ${key}`, error);
    throw error;
  }
}

async function loadFromBlob<T>(key: string, fallback: T[] = []): Promise<T[]> {
  if (!isVercelProduction() || !list) {
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
    const { blobs } = await list({ prefix: key });
    if (blobs.length === 0) {
      return fallback;
    }

    const response = await fetch(blobs[0].url);
    const data = await response.json();
    return Array.isArray(data) ? data : fallback;
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
  
  // Filter files and collect URLs for deletion
  const filesToDelete: MediaFile[] = [];
  const filtered = files.filter(file => {
    if (ids.includes(file.id)) {
      filesToDelete.push(file);
      deletedFiles.push(file.id);
      return false;
    }
    return true;
  });
  
  // Delete actual blob files if in production
  if (isVercelProduction() && del) {
    for (const file of filesToDelete) {
      try {
        // Extract blob URL and delete from Vercel Blob
        if (file.url && file.url.includes('blob.vercel-storage.com')) {
          await del(file.url);
          console.log(`✅ Deleted blob file: ${file.name}`);
        }
      } catch (error) {
        console.error(`❌ Failed to delete blob file: ${file.name}`, error);
        errors.push(`Failed to delete ${file.name}`);
      }
    }
  }
  
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
  const env = getEnvironmentInfo();
  
  if (!env.isProduction) {
    throw new Error('File upload ke Blob hanya tersedia di production environment');
  }
  
  if (!env.isVercel) {
    throw new Error('File upload ke Blob hanya tersedia di Vercel hosting');
  }
  
  if (!put) {
    throw new Error('@vercel/blob module tidak tersedia. Pastikan dependency sudah terinstall.');
  }
  
  if (!hasBlobToken()) {
    throw new Error('BLOB_READ_WRITE_TOKEN tidak ditemukan. Silakan setup Vercel Blob storage di dashboard.');
  }

  try {
    // Upload file ke Vercel Blob
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    
    console.log(`🚀 Uploading to Vercel Blob: ${filename}`);
    
    const blob = await put(`media/${filename}`, file, {
      access: 'public',
      contentType: file.type
    });

    console.log(`✅ Successfully uploaded to Blob: ${blob.url}`);

    // Create media file entry
    const mediaFile: MediaFile = {
      id: timestamp.toString(),
      name: filename,
      originalName: file.name,
      url: blob.url,
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
    console.error('❌ Vercel Blob upload error:', error);
    
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
        throw new Error('BLOB_READ_WRITE_TOKEN tidak valid atau expired. Silakan generate token baru di Vercel Dashboard → Storage → Blob → Settings.');
      }
      
      if (errorMessage.includes('forbidden') || errorMessage.includes('403')) {
        throw new Error('Akses ke Blob storage ditolak. Pastikan BLOB_READ_WRITE_TOKEN memiliki permission write yang benar.');
      }
      
      if (errorMessage.includes('not found') || errorMessage.includes('404')) {
        throw new Error('Blob storage tidak ditemukan. Pastikan Blob database sudah dibuat di Vercel Dashboard → Storage.');
      }
      
      if (errorMessage.includes('too large') || errorMessage.includes('413')) {
        throw new Error('File terlalu besar. Maksimal ukuran file adalah 50MB. Silakan compress file terlebih dahulu.');
      }
      
      if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
        throw new Error('Quota Blob storage terlampaui. Upgrade plan Vercel atau hapus file lama untuk membuat ruang.');
      }
      
      if (errorMessage.includes('timeout')) {
        throw new Error('Upload timeout. Coba upload file yang lebih kecil atau check koneksi internet.');
      }
      
      if (errorMessage.includes('blob_read_write_token')) {
        throw new Error('BLOB_READ_WRITE_TOKEN belum diset. Silakan set environment variable di Vercel Dashboard → Settings → Environment Variables.');
      }
    }
    
    // Generic error with helpful message
    throw new Error(`Vercel Blob upload gagal: ${error instanceof Error ? error.message : 'Unknown error'}. Silakan check BLOB_READ_WRITE_TOKEN di environment variables.`);
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