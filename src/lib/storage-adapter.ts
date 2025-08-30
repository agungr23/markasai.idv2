// Universal storage adapter - Edge Runtime compatible
// No Node.js modules, pure memory-based storage for Edge Runtime
import { getEnvironmentInfo, logStorageInfo } from './environment';

// Runtime detection
const isServerEnvironment = typeof window === 'undefined';
const isEdgeRuntime = (() => {
  try {
    return (
      isServerEnvironment &&
      typeof globalThis !== 'undefined' &&
      (
        // Check for Edge Runtime indicators
        'EdgeRuntime' in globalThis ||
        (globalThis as any).process?.env?.NEXT_RUNTIME === 'edge' ||
        // Check if we're in a serverless environment without file system access
        ('process' in globalThis && !(globalThis as any).process?.versions?.node)
      )
    );
  } catch {
    return false;
  }
})();

export interface StorageAdapter {
  read<T>(key: string, defaultValue: T): Promise<T>;
  write<T>(key: string, data: T): Promise<void>;
  exists(key: string): Promise<boolean>;
}

class FileSystemStorage implements StorageAdapter {
  // This class is only used in Node.js environments
  // We'll handle the file system operations through dynamic imports
  private dataDir: string;

  constructor() {
    // This constructor should never be called in Edge Runtime
    if (isEdgeRuntime) {
      throw new Error('FileSystemStorage not supported in Edge Runtime');
    }
    
    // For Node.js environments, we'll use a simple fallback
    this.dataDir = '/tmp/markasai-data';
  }

  async read<T>(key: string, defaultValue: T): Promise<T> {
    // In Edge Runtime, this should never be called
    // Return default value as fallback
    console.warn('File system read not available, using default value');
    return defaultValue;
  }

  async write<T>(key: string, data: T): Promise<void> {
    // In Edge Runtime, this should never be called
    console.warn('File system write not available, data not persisted');
  }

  async exists(key: string): Promise<boolean> {
    return false;
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
  private memoryStorage = new InMemoryStorage();

  constructor() {
    // In Edge Runtime, we only use memory storage
    // No file system operations
  }

  async read<T>(key: string, defaultValue: T): Promise<T> {
    // Always use memory storage for Edge Runtime compatibility
    return await this.memoryStorage.read(key, defaultValue);
  }

  async write<T>(key: string, data: T): Promise<void> {
    // Always write to memory storage
    await this.memoryStorage.write(key, data);
  }

  async exists(key: string): Promise<boolean> {
    return await this.memoryStorage.exists(key);
  }
}

// Factory function to create appropriate storage adapter
export async function createStorageAdapter(): Promise<StorageAdapter> {
  const env = getEnvironmentInfo();
  
  // Log storage configuration in development
  if (!env.isProduction) {
    logStorageInfo();
  }
  
  // For now, always use memory storage to avoid Edge Runtime issues
  // This ensures 100% compatibility across all deployment environments
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