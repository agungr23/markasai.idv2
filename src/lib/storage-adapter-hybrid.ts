// Hybrid storage adapter - JSON file ketika memungkinkan, memory untuk Edge Runtime
import { getEnvironmentInfo, logStorageInfo } from './environment';

export interface StorageAdapter {
  read<T>(key: string, defaultValue: T): Promise<T>;
  write<T>(key: string, data: T): Promise<void>;
  exists(key: string): Promise<boolean>;
}

// Pure memory storage untuk Edge Runtime
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

// JSON file storage untuk environment yang mendukung
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

  private async canUseFileSystem(): Promise<boolean> {
    try {
      // Cek apakah kita bisa akses file system
      if (typeof window !== 'undefined') return false; // Browser
      if (typeof process === 'undefined') return false; // Edge Runtime
      
      // Test akses file system dengan menggunakan dynamic import
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // Test baca file yang pasti ada
      await fs.access(path.join(process.cwd(), 'package.json'));
      return true;
    } catch {
      return false;
    }
  }

  async read<T>(key: string, defaultValue: T): Promise<T> {
    // Cek cache memory dulu
    const cached = this.memoryCache.get(key) as T | undefined;
    if (cached !== undefined) {
      return cached;
    }

    try {
      if (await this.canUseFileSystem()) {
        const fs = await import('fs/promises');
        const path = await import('path');
        const filePath = path.join(process.cwd(), this.getFilePath(key));
        
        const data = await fs.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(data) as T;
        
        // Cache ke memory
        this.memoryCache.set(key, parsed);
        console.log(`📁 Data dimuat dari JSON: ${this.getFilePath(key)}`);
        return parsed;
      }
    } catch (error) {
      console.log(`File JSON untuk ${key} tidak ditemukan, menggunakan nilai default`);
    }

    // Fallback ke default dan cache
    this.memoryCache.set(key, defaultValue);
    return defaultValue;
  }

  async write<T>(key: string, data: T): Promise<void> {
    // Selalu update cache memory
    this.memoryCache.set(key, data);

    try {
      if (await this.canUseFileSystem()) {
        const fs = await import('fs/promises');
        const path = await import('path');
        const filePath = path.join(process.cwd(), this.getFilePath(key));
        
        // Pastikan direktori ada
        const dir = path.dirname(filePath);
        await fs.mkdir(dir, { recursive: true });
        
        // Tulis file JSON dengan format yang rapi
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`💾 Data disimpan ke file JSON: ${this.getFilePath(key)}`);
      } else {
        console.log(`💾 Data disimpan ke memory: ${key} (file system tidak tersedia)`);
      }
    } catch (error) {
      console.warn(`⚠️ Tidak bisa menyimpan ke file JSON untuk ${key}:`, error);
      console.log(`💾 Data disimpan ke memory saja: ${key}`);
    }
  }

  async exists(key: string): Promise<boolean> {
    return this.memoryCache.has(key);
  }
}

// Factory function untuk membuat storage adapter yang tepat
export async function createStorageAdapter(): Promise<StorageAdapter> {
  const env = getEnvironmentInfo();
  
  if (!env.isProduction) {
    logStorageInfo();
  }
  
  try {
    // Coba gunakan JSON file storage dulu
    const jsonStorage = new JSONFileStorage();
    
    // Test apakah bisa baca/tulis file
    const testKey = '__test__';
    const testValue = { test: true, timestamp: Date.now() };
    
    await jsonStorage.write(testKey, testValue);
    const result = await jsonStorage.read(testKey, { test: false });
    
    if (result.test === true) {
      console.log('🔧 Menggunakan JSON file storage dengan cache memory');
      return jsonStorage;
    }
  } catch (error) {
    console.log('File system tidak tersedia, menggunakan memory storage');
  }
  
  console.log('🔧 Menggunakan memory storage (kompatibel universal)');
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