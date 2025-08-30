import { Product } from '@/types';
import { products as defaultProducts } from '@/data/products';

// In-memory storage for products (will be replaced by database in production)
let productsData: Product[] = [...defaultProducts];

export async function getProductsFromStorage(): Promise<Product[]> {
  return productsData;
}

export async function getProductByIdFromStorage(id: string): Promise<Product | null> {
  return productsData.find(product => product.id === id) || null;
}

export async function getProductBySlugFromStorage(slug: string): Promise<Product | null> {
  return productsData.find(product => product.slug === slug) || null;
}

export async function saveProductToStorage(product: Product): Promise<Product> {
  const existingIndex = productsData.findIndex(p => p.id === product.id);
  
  if (existingIndex >= 0) {
    // Update existing product
    productsData[existingIndex] = product;
  } else {
    // Add new product
    productsData.push(product);
  }
  
  return product;
}

export async function deleteProductFromStorage(id: string): Promise<boolean> {
  const initialLength = productsData.length;
  productsData = productsData.filter(product => product.id !== id);
  return productsData.length < initialLength;
}

export async function getProductCategoriesFromStorage(): Promise<string[]> {
  const categories = [...new Set(productsData.map(product => product.category))];
  return categories.sort();
}

// Generate unique ID for new products
export function generateProductId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Generate slug from title
export function generateProductSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
