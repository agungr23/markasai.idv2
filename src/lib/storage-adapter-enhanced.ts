// Enhanced storage adapter with JSON file persistence for development
import { getEnvironmentInfo, logStorageInfo } from './environment';

export interface StorageAdapter {
  read<T>(key: string, defaultValue: T): Promise<T>;
  write<T>(key: string, data: T): Promise<void>;
  exists(key: string): Promise<boolean>;
}

class InMemoryStorage implements StorageAdapter {
  private static store = new Map<string, unknown>();

  async read<T>(key: string, defaultValue: T): Promise<T> {
    const data = InMemoryStorage.store.get(key) as T | undefined;
    if (data !== undefined) {
      return data;
    }
    await this.write(key, defaultValue);
    return defaultValue;
  }

  async write<T>(key: string, data: T): Promise<void> {
    InMemoryStorage.store.set(key, data);
    console.log(`✅ Data saved to memory: ${key}`);
  }

  async exists(key: string): Promise<boolean> {
    return InMemoryStorage.store.has(key);
  }
}

class JSONFileStorage implements StorageAdapter {
  private memoryCache = new Map<string, unknown>();

  private getFilePath(key: string): string {
    const fileMap: Record<string, string> = {
      'products': 'public/data/products.json',
      'blog-posts': 'data/blog-posts.json',
      'case-studies': 'data/case-studies.json',
      'testimonials': 'data/testimonials.json',
      'settings': 'data/settings.json'
    };
    return fileMap[key] || `data/${key}.json`;
  }

  async read<T>(key: string, defaultValue: T): Promise<T> {
    // Check memory cache first
    const cached = this.memoryCache.get(key) as T | undefined;
    if (cached !== undefined) {
      return cached;
    }

    try {
      // Try to read from file system (only works in Node.js)
      if (typeof window === 'undefined' && typeof require !== 'undefined') {
        const fs = require('fs').promises;
        const path = require('path');
        const filePath = path.join(process.cwd(), this.getFilePath(key));
        
        const data = await fs.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(data) as T;
        
        // Cache in memory
        this.memoryCache.set(key, parsed);
        return parsed;
      }
    } catch (error) {
      console.log(`JSON file for ${key} not found, using default value`);
    }

    // Fallback to default and cache it
    this.memoryCache.set(key, defaultValue);
    return defaultValue;
  }

  async write<T>(key: string, data: T): Promise<void> {
    // Always update memory cache
    this.memoryCache.set(key, data);

    try {
      // Try to write to file system (only works in Node.js)
      if (typeof window === 'undefined' && typeof require !== 'undefined') {
        const fs = require('fs').promises;
        const path = require('path');
        const filePath = path.join(process.cwd(), this.getFilePath(key));
        
        // Ensure directory exists
        const dir = path.dirname(filePath);
        await fs.mkdir(dir, { recursive: true });
        
        // Write JSON file with pretty formatting
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`✅ Data saved to JSON file: ${this.getFilePath(key)}`);
      } else {
        console.log(`✅ Data saved to memory: ${key} (file system not available)`);
      }
    } catch (error) {
      console.warn(`⚠️ Could not save to JSON file for ${key}:`, error);
      console.log(`✅ Data saved to memory only: ${key}`);
    }
  }

  async exists(key: string): Promise<boolean> {
    return this.memoryCache.has(key);
  }
}

// Factory function to create appropriate storage adapter
export async function createStorageAdapter(): Promise<StorageAdapter> {
  const env = getEnvironmentInfo();
  
  // Log storage configuration in development
  if (!env.isProduction) {
    logStorageInfo();
  }
  
  // Use JSON file storage in development for persistence
  if (!env.isProduction && typeof window === 'undefined') {
    try {
      console.log('🔧 Using JSON file storage for development (with memory cache)');
      return new JSONFileStorage();
    } catch (error) {
      console.warn('File system not available, falling back to memory storage');
    }
  }
  
  // Use memory storage for production/serverless
  console.log('🔧 Using memory storage (universally compatible)');
  return new InMemoryStorage();
}

// Singleton instance
let storageInstance: StorageAdapter | null = null;

export async function getStorageAdapter(): Promise<StorageAdapter> {
  if (!storageInstance) {
    storageInstance = await createStorageAdapter();
  }
  return storageInstance;
}