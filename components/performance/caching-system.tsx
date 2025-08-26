'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items in cache
  serialize?: boolean; // Whether to serialize data
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize: number;
  
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  set<T>(key: string, data: T, ttl = 5 * 60 * 1000): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Cleanup expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

class LocalStorageCache {
  private prefix: string;
  
  constructor(prefix = 'rudybtz_cache_') {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  set<T>(key: string, data: T, ttl = 30 * 60 * 1000): void {
    if (typeof window === 'undefined') return;
    
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl
      };
      
      localStorage.setItem(this.getKey(key), JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to cache to localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(this.getKey(key));
      if (!stored) return null;
      
      const item: CacheItem<T> = JSON.parse(stored);
      
      // Check if expired
      if (Date.now() > item.expiresAt) {
        localStorage.removeItem(this.getKey(key));
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.warn('Failed to retrieve from localStorage cache:', error);
      return null;
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.getKey(key));
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Cleanup expired items
  cleanup(): void {
    if (typeof window === 'undefined') return;
    
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '');
          if (Date.now() > item.expiresAt) {
            localStorage.removeItem(key);
          }
        } catch {
          // Remove corrupted items
          localStorage.removeItem(key);
        }
      }
    });
  }
}

// Global cache instances
export const memoryCache = new MemoryCache(200);
export const localStorageCache = new LocalStorageCache();

// React hook for caching
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) {
  const { ttl = 5 * 60 * 1000, serialize = false } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cache = serialize ? localStorageCache : memoryCache;

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Check cache first
    if (!forceRefresh) {
      const cached = cache.get<T>(key);
      if (cached) {
        setData(cached);
        return cached;
      }
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setLoading(true);
    setError(null);
    
    abortControllerRef.current = new AbortController();

    try {
      const result = await fetcher();
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      // Cache the result
      cache.set(key, result, ttl);
      setData(result);
      return result;
    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl, cache]);

  const invalidate = useCallback(() => {
    cache.delete(key);
    setData(null);
  }, [key, cache]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    invalidate,
    fetchData
  };
}

// Hook for caching API responses
export function useApiCache<T>(
  url: string | null,
  options: RequestInit & CacheOptions = {}
) {
  const { ttl, serialize, ...fetchOptions } = options;
  
  const fetcher = useCallback(async () => {
    if (!url) throw new Error('No URL provided');
    
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }, [url, fetchOptions]);

  return useCache<T>(url || '', fetcher, { 
    ...(ttl !== undefined && { ttl }), 
    ...(serialize !== undefined && { serialize }) 
  });
}

// Cache preloader
export function preloadCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) {
  const { ttl = 5 * 60 * 1000, serialize = false } = options;
  const cache = serialize ? localStorageCache : memoryCache;
  
  // Only preload if not already cached
  if (!cache.has(key)) {
    fetcher()
      .then(data => cache.set(key, data, ttl))
      .catch(error => console.warn('Cache preload failed:', error));
  }
}

// Cache cleanup utility
export function cleanupCaches() {
  memoryCache.cleanup();
  localStorageCache.cleanup();
}

// Auto cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(cleanupCaches, 5 * 60 * 1000);
}