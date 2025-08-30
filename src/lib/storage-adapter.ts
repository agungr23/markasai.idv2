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
        (globalThis as { process?: { env?: { NEXT_RUNTIME?: string } } }).process?.env?.NEXT_RUNTIME === 'edge' ||
        // Check if we're in a serverless environment without file system access
        ('process' in globalThis && !(globalThis as { process?: { versions?: { node?: string } } }).process?.versions?.node)
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