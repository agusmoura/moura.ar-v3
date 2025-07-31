/**
 * Cache Manager - Multi-layer caching system
 * Provides memory, localStorage, and sessionStorage caching with TTL support
 */

export interface CacheEntry<T = unknown> {
  value: T;
  timestamp: number;
  ttl?: number;
}

export interface CacheAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  delete(key: string): void;
  clear(): void;
  keys(): string[];
}

// Memory cache adapter
class MemoryCacheAdapter implements CacheAdapter {
  private cache = new Map<string, CacheEntry>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check TTL expiration
    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, ttl?: number): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// LocalStorage cache adapter
class LocalStorageCacheAdapter implements CacheAdapter {
  private prefix = 'moura_cache_';

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      
      // Check TTL expiration
      if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
        this.delete(key);
        return null;
      }

      return entry.value;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T, ttl?: number): void {
    if (typeof window === 'undefined') return;
    
    try {
      const entry: CacheEntry<T> = {
        value,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch (error) {
      // Handle localStorage quota exceeded
      console.warn('LocalStorage cache write failed:', error);
    }
  }

  delete(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    
    const keys = this.keys();
    keys.forEach(key => this.delete(key));
  }

  keys(): string[] {
    if (typeof window === 'undefined') return [];
    
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.replace(this.prefix, ''));
      }
    }
    return keys;
  }
}

// Session storage cache adapter
class SessionStorageCacheAdapter implements CacheAdapter {
  private prefix = 'moura_session_';

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = sessionStorage.getItem(this.prefix + key);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      return entry.value;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      const entry: CacheEntry<T> = {
        value,
        timestamp: Date.now()
      };
      sessionStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch (error) {
      console.warn('SessionStorage cache write failed:', error);
    }
  }

  delete(key: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    
    const keys = this.keys();
    keys.forEach(key => this.delete(key));
  }

  keys(): string[] {
    if (typeof window === 'undefined') return [];
    
    const keys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.replace(this.prefix, ''));
      }
    }
    return keys;
  }
}

// Cache levels enum
export enum CacheLevel {
  MEMORY = 'memory',
  LOCAL_STORAGE = 'localStorage',
  SESSION_STORAGE = 'sessionStorage'
}

// Main cache manager
export class CacheManager {
  private adapters: Map<CacheLevel, CacheAdapter>;

  constructor() {
    this.adapters = new Map([
      [CacheLevel.MEMORY, new MemoryCacheAdapter()],
      [CacheLevel.LOCAL_STORAGE, new LocalStorageCacheAdapter()],
      [CacheLevel.SESSION_STORAGE, new SessionStorageCacheAdapter()]
    ]);
  }

  async get<T>(key: string, level: CacheLevel = CacheLevel.MEMORY): Promise<T | null> {
    const adapter = this.adapters.get(level);
    if (!adapter) return null;

    return adapter.get<T>(key);
  }

  async set<T>(
    key: string, 
    value: T, 
    ttl?: number, 
    level: CacheLevel = CacheLevel.MEMORY
  ): Promise<void> {
    const adapter = this.adapters.get(level);
    if (!adapter) return;

    adapter.set(key, value, ttl);
  }

  async delete(key: string, level?: CacheLevel): Promise<void> {
    if (level) {
      const adapter = this.adapters.get(level);
      if (adapter) {
        adapter.delete(key);
      }
    } else {
      // Delete from all levels
      this.adapters.forEach(adapter => adapter.delete(key));
    }
  }

  async clear(level?: CacheLevel): Promise<void> {
    if (level) {
      const adapter = this.adapters.get(level);
      if (adapter) {
        adapter.clear();
      }
    } else {
      // Clear all levels
      this.adapters.forEach(adapter => adapter.clear());
    }
  }

  // Multi-level get with fallback
  async getWithFallback<T>(key: string): Promise<T | null> {
    // Try memory first (fastest)
    let value = await this.get<T>(key, CacheLevel.MEMORY);
    if (value !== null) return value;

    // Try localStorage second
    value = await this.get<T>(key, CacheLevel.LOCAL_STORAGE);
    if (value !== null) {
      // Store in memory for next time
      await this.set(key, value, undefined, CacheLevel.MEMORY);
      return value;
    }

    // Try sessionStorage last
    value = await this.get<T>(key, CacheLevel.SESSION_STORAGE);
    if (value !== null) {
      // Store in memory and localStorage for next time
      await this.set(key, value, undefined, CacheLevel.MEMORY);
      await this.set(key, value, undefined, CacheLevel.LOCAL_STORAGE);
      return value;
    }

    return null;
  }

  // Multi-level set with replication
  async setWithReplication<T>(
    key: string, 
    value: T, 
    ttl?: number,
    levels: CacheLevel[] = [CacheLevel.MEMORY, CacheLevel.LOCAL_STORAGE]
  ): Promise<void> {
    const promises = levels.map(level => this.set(key, value, ttl, level));
    await Promise.all(promises);
  }

  // Cache statistics
  getStats(): Record<CacheLevel, { keys: number; size: string }> {
    const stats: Record<string, { keys: number; size: string }> = {};

    this.adapters.forEach((adapter, level) => {
      const keys = adapter.keys();
      stats[level] = {
        keys: keys.length,
        size: this.estimateSize(keys, adapter)
      };
    });

    return stats as Record<CacheLevel, { keys: number; size: string }>;
  }

  private estimateSize(keys: string[], adapter: CacheAdapter): string {
    let totalSize = 0;
    
    keys.forEach(key => {
      const value = adapter.get(key);
      if (value) {
        try {
          totalSize += JSON.stringify(value).length;
        } catch {
          totalSize += 100; // Estimate for non-serializable objects
        }
      }
    });

    // Convert to human readable format
    if (totalSize < 1024) return `${totalSize}B`;
    if (totalSize < 1024 * 1024) return `${(totalSize / 1024).toFixed(1)}KB`;
    return `${(totalSize / (1024 * 1024)).toFixed(1)}MB`;
  }
}