// Universal storage adapter - Edge Runtime compatible
// Menggunakan strategy detection tanpa Node.js modules
import { getEnvironmentInfo, logStorageInfo } from './environment';

export interface StorageAdapter {
  read<T>(key: string, defaultValue: T): Promise<T>;
  write<T>(key: string, data: T): Promise<void>;
  exists(key: string): Promise<boolean>;
}

// Pure memory storage - 100% Edge Runtime compatible
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
    console.log(`✅ Data disimpan ke memory: ${key}`);
  }

  async exists(key: string): Promise<boolean> {
    return InMemoryStorage.store.has(key);
  }
}

// Enhanced memory storage dengan JSON fallback untuk default values
class EnhancedMemoryStorage implements StorageAdapter {
  private static store = new Map<string, unknown>();
  private static initialized = new Set<string>();

  private async loadDefaultData<T>(key: string, defaultValue: T): Promise<T> {
    // Hanya load default data sekali per key
    if (EnhancedMemoryStorage.initialized.has(key)) {
      return defaultValue;
    }

    try {
      // Coba load data dari public URL jika di browser/development
      const jsonPaths: Record<string, string> = {
        'products': '/data/products.json',
        'blog-posts': '/api/default-data/blog-posts',
        'case-studies': '/api/default-data/case-studies', 
        'testimonials': '/api/default-data/testimonials',
        'settings': '/api/default-data/settings'
      };

      const path = jsonPaths[key];
      if (path && typeof fetch !== 'undefined') {
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json() as T;
          EnhancedMemoryStorage.store.set(key, data);
          EnhancedMemoryStorage.initialized.add(key);
          console.log(`📁 Data default dimuat untuk ${key}`);
          return data;
        }
      }
    } catch (error) {
      console.log(`Menggunakan fallback default untuk ${key}`);
    }

    EnhancedMemoryStorage.initialized.add(key);
    return defaultValue;
  }

  async read<T>(key: string, defaultValue: T): Promise<T> {
    const data = EnhancedMemoryStorage.store.get(key) as T | undefined;
    if (data !== undefined) {
      return data;
    }

    // Load default data jika belum ada
    const loadedData = await this.loadDefaultData(key, defaultValue);
    await this.write(key, loadedData);
    return loadedData;
  }

  async write<T>(key: string, data: T): Promise<void> {
    EnhancedMemoryStorage.store.set(key, data);
    console.log(`💾 Data disimpan ke enhanced memory: ${key}`);
  }

  async exists(key: string): Promise<boolean> {
    return EnhancedMemoryStorage.store.has(key);
  }
}

// Factory function untuk membuat storage adapter yang tepat
export async function createStorageAdapter(): Promise<StorageAdapter> {
  const env = getEnvironmentInfo();
  
  // Log konfigurasi storage di development
  if (!env.isProduction) {
    logStorageInfo();
  }
  
  // Selalu gunakan enhanced memory storage untuk kompatibilitas universal
  // Enhanced version akan coba load default data dari JSON jika memungkinkan
  console.log('🔧 Menggunakan enhanced memory storage (universal compatible)');
  return new EnhancedMemoryStorage();
}

// Singleton instance
let storageInstance: StorageAdapter | null = null;

export async function getStorageAdapter(): Promise<StorageAdapter> {
  if (!storageInstance) {
    storageInstance = await createStorageAdapter();
  }
  return storageInstance;
}