// Universal storage adapter that works in both development and production
// Safe for Edge Runtime with proper type handling
import { getEnvironmentInfo, logStorageInfo } from './environment';

// Conditional import for Node.js modules using dynamic imports
let fs: any = null;
let path: any = null;
let fsPromises: any = null;

// Check if we're in Node.js environment with type safety
const isNodeEnvironment = (() => {
  try {
    return (
      typeof globalThis !== 'undefined' && 
      'process' in globalThis &&
      (globalThis as any).process?.versions?.node
    );
  } catch {
    return false;
  }
})();

// Only import fs and path in Node.js runtime
if (isNodeEnvironment) {
  try {
    // Use eval to avoid static analysis
    const nodeRequire = eval('require');
    fs = nodeRequire('fs');
    path = nodeRequire('path');
    fsPromises = fs.promises;
  } catch (error) {
    console.warn('File system modules not available in this runtime');
  }
}

export interface StorageAdapter {
  read<T>(key: string, defaultValue: T): Promise<T>;
  write<T>(key: string, data: T): Promise<void>;
  exists(key: string): Promise<boolean>;
}

class FileSystemStorage implements StorageAdapter {
  private dataDir: string;

  constructor() {
    if (!path || !fs) {
      throw new Error('File system not available in this runtime');
    }
    // Safe process.cwd() call with type casting
    const processCwd = isNodeEnvironment ? (globalThis as any).process.cwd() : '/tmp';
    this.dataDir = path.join(processCwd, 'data');
  }

  private async ensureDataDir(): Promise<void> {
    if (!fsPromises) throw new Error('File system not available');
    try {
      await fsPromises.access(this.dataDir);
    } catch {
      await fsPromises.mkdir(this.dataDir, { recursive: true });
    }
  }

  private getFilePath(key: string): string {
    if (!path) throw new Error('Path module not available');
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
  private fileStorage: FileSystemStorage | null = null;
  private memoryStorage = new InMemoryStorage();

  constructor() {
    // Only initialize file storage if available
    if (fs && path && fsPromises) {
      try {
        this.fileStorage = new FileSystemStorage();
      } catch (error) {
        console.warn('File storage not available, using memory only');
      }
    }
  }

  async read<T>(key: string, defaultValue: T): Promise<T> {
    try {
      // Try file storage first if available
      if (this.fileStorage) {
        return await this.fileStorage.read(key, defaultValue);
      }
    } catch (error) {
      console.log(`File storage failed for ${key}, using memory storage`);
    }
    
    // Fallback to memory storage
    return await this.memoryStorage.read(key, defaultValue);
  }

  async write<T>(key: string, data: T): Promise<void> {
    // Always write to memory first for fast access
    await this.memoryStorage.write(key, data);
    
    // Try to persist to file system if available
    if (this.fileStorage) {
      try {
        await this.fileStorage.write(key, data);
      } catch (error) {
        console.warn(`Could not persist ${key} to file system:`, error);
        // Continue with memory-only storage
      }
    }
  }

  async exists(key: string): Promise<boolean> {
    const memoryExists = await this.memoryStorage.exists(key);
    
    if (this.fileStorage) {
      try {
        const fileExists = await this.fileStorage.exists(key);
        return fileExists || memoryExists;
      } catch {
        return memoryExists;
      }
    }
    
    return memoryExists;
  }
}

// Factory function to create appropriate storage adapter
export function createStorageAdapter(): StorageAdapter {
  const env = getEnvironmentInfo();
  
  // Log storage configuration in development
  if (!env.isProduction) {
    logStorageInfo();
  }
  
  // Check if we're in Edge Runtime or file system is not available
  const isEdgeRuntime = env.runtime === 'edge' || !fs || !path;
  
  if (env.isProduction && (env.isServerless || isEdgeRuntime)) {
    // Use memory storage for serverless/edge environments
    console.log('🔧 Using memory storage for serverless/edge environment');
    return new InMemoryStorage();
  }
  
  if (isEdgeRuntime) {
    // Use memory storage if file system not available
    console.log('🔧 Using memory storage (file system not available)');
    return new InMemoryStorage();
  }
  
  // Use hybrid storage for Node.js environments
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