/**
 * API Cache Service
 * 
 * This service provides caching functionality for API requests to reduce redundant
 * network calls and improve performance.
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface CacheOptions {
  /** Cache expiration time in milliseconds */
  expiryTime?: number;
  /** Force refresh the cache even if it's not expired */
  forceRefresh?: boolean;
  /** Cache key to use instead of the default generated one */
  cacheKey?: string;
}

class ApiCache {
  private static instance: ApiCache;
  private cache: Map<string, CacheItem<any>>;
  private defaultExpiryTime: number = 5 * 60 * 1000; // 5 minutes default

  private constructor() {
    this.cache = new Map();
    
    // Clean up expired cache items periodically
    setInterval(() => this.cleanExpiredItems(), 60 * 1000); // Clean every minute
  }

  /**
   * Get the singleton instance of ApiCache
   */
  public static getInstance(): ApiCache {
    if (!ApiCache.instance) {
      ApiCache.instance = new ApiCache();
    }
    return ApiCache.instance;
  }

  /**
   * Set the default expiry time for cache items
   * @param time Time in milliseconds
   */
  public setDefaultExpiryTime(time: number): void {
    this.defaultExpiryTime = time;
  }

  /**
   * Set the TTL (Time To Live) for cache items
   * Alias for setDefaultExpiryTime for compatibility
   * @param time Time in milliseconds
   */
  public setTTL(time: number): void {
    this.setDefaultExpiryTime(time);
  }

  /**
   * Generate a cache key from the URL and parameters
   */
  private generateCacheKey(url: string, params?: Record<string, any>): string {
    if (!params) return url;
    const sortedParams = Object.entries(params)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .join('&');
    return `${url}?${sortedParams}`;
  }

  /**
   * Check if a cache item is expired
   */
  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() > item.expiry;
  }

  /**
   * Clean expired items from the cache
   */
  private cleanExpiredItems(): void {
    for (const [key, item] of this.cache.entries()) {
      if (this.isExpired(item)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Check if an item exists in the cache and is not expired
   */
  public has(key: string): boolean {
    const item = this.cache.get(key);
    return !!item && !this.isExpired(item);
  }

  /**
   * Get an item from the cache
   */
  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item || this.isExpired(item)) {
      if (item) this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  /**
   * Set an item in the cache
   */
  public set<T>(key: string, data: T, expiryTime?: number): void {
    const expiry = Date.now() + (expiryTime || this.defaultExpiryTime);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry
    });
  }

  /**
   * Delete an item from the cache
   */
  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear the entire cache
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Fetch data with caching
   * 
   * This method will check the cache first and only make an API call if
   * the data is not in the cache or has expired.
   */
  public async fetch<T>(
    url: string, 
    options: RequestInit = {}, 
    cacheOptions: CacheOptions = {}
  ): Promise<T> {
    const { 
      expiryTime = this.defaultExpiryTime, 
      forceRefresh = false,
      cacheKey
    } = cacheOptions;
    
    // Generate cache key
    const key = cacheKey || this.generateCacheKey(url, options.body ? JSON.parse(options.body as string) : undefined);
    
    // Check cache first (unless force refresh is true)
    if (!forceRefresh) {
      const cachedData = this.get<T>(key);
      if (cachedData) {
        return cachedData;
      }
    }
    
    // If not in cache or force refresh, make the API call
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the response
      this.set(key, data, expiryTime);
      
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}

export default ApiCache.getInstance();
