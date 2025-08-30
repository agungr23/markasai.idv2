// Universal storage adapter that works in both development and production
import fs from 'fs';
import path from 'path';
import { getEnvironmentInfo, logStorageInfo } from './environment';

const { promises: fsPromises } = fs;

export interface StorageAdapter {
  read<T>(key: string, defaultValue: T): Promise<T>;
  write<T>(key: string, data: T): Promise<void>;
  exists(key: string): Promise<boolean>;
}

class FileSystemStorage implements StorageAdapter {
  private dataDir = path.join(process.cwd(), 'data');

  private async ensureDataDir(): Promise<void> {
    try {
      await fsPromises.access(this.dataDir);
    } catch {
      await fsPromises.mkdir(this.dataDir, { recursive: true });
    }
  }

  private getFilePath(key: string): string {
    return path.join(this.dataDir, `${key}.json`);
  }

  async read<T>(key: string, defaultValue: T): Promise<T> {
    try {
      await this.ensureDataDir();
      const filePath = this.getFilePath(key);
      const data = await fsPromises.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.log(`File ${key} not found, using default value`);
      await this.write(key, defaultValue);
      return defaultValue;
    }
  }

  async write<T>(key: string, data: T): Promise<void> {
    try {
      await this.ensureDataDir();
      const filePath = this.getFilePath(key);
      await fsPromises.writeFile(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Data saved to ${key}.json`);
    } catch (error) {
      console.error(`❌ Failed to save ${key}:`, error);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.ensureDataDir();
      const filePath = this.getFilePath(key);
      await fsPromises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

class InMemoryStorage implements StorageAdapter {
  private static store = new Map<string, any>();

  async read<T>(key: string, defaultValue: T): Promise<T> {
    const data = InMemoryStorage.store.get(key);
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

class HybridStorage implements StorageAdapter {
  private fileStorage = new FileSystemStorage();
  private memoryStorage = new InMemoryStorage();

  async read<T>(key: string, defaultValue: T): Promise<T> {
    try {
      // Try file storage first
      return await this.fileStorage.read(key, defaultValue);
    } catch (error) {
      console.log(`File storage failed for ${key}, using memory storage`);
      return await this.memoryStorage.read(key, defaultValue);
    }
  }

  async write<T>(key: string, data: T): Promise<void> {
    // Always write to memory first for fast access
    await this.memoryStorage.write(key, data);
    
    try {
      // Try to persist to file system
      await this.fileStorage.write(key, data);
    } catch (error) {
      console.warn(`Could not persist ${key} to file system:`, error);
      // Continue with memory-only storage
    }
  }

  async exists(key: string): Promise<boolean> {
    const fileExists = await this.fileStorage.exists(key);
    const memoryExists = await this.memoryStorage.exists(key);
    return fileExists || memoryExists;
  }
}

// Factory function to create appropriate storage adapter
export function createStorageAdapter(): StorageAdapter {
  const env = getEnvironmentInfo();
  
  // Log storage configuration in development
  if (!env.isProduction) {
    logStorageInfo();
  }
  
  if (env.isProduction && env.isServerless) {
    // Use memory storage for serverless environments
    console.log('🔧 Using memory storage for serverless environment');
    return new InMemoryStorage();
  }
  
  // Use hybrid storage for development and self-hosted production
  console.log('🔧 Using hybrid storage (file + memory fallback)');
  return new HybridStorage();
}

// Singleton instance
let storageInstance: StorageAdapter | null = null;

export function getStorageAdapter(): StorageAdapter {
  if (!storageInstance) {
    storageInstance = createStorageAdapter();
  }
  return storageInstance;
}