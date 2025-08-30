import { Product } from '@/types';
import { products as defaultProducts } from '@/data/products';
import { getStorageAdapter } from './storage-adapter';

export async function getProductsFromStorage(): Promise<Product[]> {
  const storage = await getStorageAdapter();
  return await storage.read('products', defaultProducts);
}

export async function getProductByIdFromStorage(id: string): Promise<Product | null> {
  const products = await getProductsFromStorage();
  return products.find(product => product.id === id) || null;
}

export async function getProductBySlugFromStorage(slug: string): Promise<Product | null> {
  const products = await getProductsFromStorage();
  return products.find(product => product.slug === slug) || null;
}

export async function saveProductToStorage(product: Product): Promise<Product> {
  const storage = await getStorageAdapter();
  const products = await getProductsFromStorage();
  
  const existingIndex = products.findIndex(p => p.id === product.id);
  
  if (existingIndex >= 0) {
    // Update existing product
    products[existingIndex] = product;
  } else {
    // Add new product
    products.push(product);
  }
  
  await storage.write('products', products);
  return product;
}

export async function deleteProductFromStorage(id: string): Promise<boolean> {
  const storage = await getStorageAdapter();
  const products = await getProductsFromStorage();
  const initialLength = products.length;
  
  const filteredProducts = products.filter(product => product.id !== id);
  await storage.write('products', filteredProducts);
  
  return filteredProducts.length < initialLength;
}


export async function getProductCategoriesFromStorage(): Promise<string[]> {
  const products = await getProductsFromStorage();
  const categories = [...new Set(products.map((product: Product) => product.category))] as string[];
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
