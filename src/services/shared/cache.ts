/**
 * Cache utility for API responses
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class APICache {
  private static instance: APICache;
  private cache: Map<string, CacheEntry<unknown>>;

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): APICache {
    if (!APICache.instance) {
      APICache.instance = new APICache();
    }
    return APICache.instance;
  }

  /**
   * Generates a cache key from the parameters
   */
  public static createKey(
    base: string,
    params: Record<string, unknown>
  ): string {
    const sortedParams = Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .sort(([a], [b]) => a.localeCompare(b));

    return `${base}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * Gets a value from the cache
   */
  public get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Sets a value in the cache
   */
  public set<T>(key: string, data: T, ttlMs: number): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Clears the entire cache
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Deletes expired entries from the cache
   */
  public cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Wraps an async function with caching
   */
  public static async withCache<T>(
    key: string,
    ttlMs: number,
    fn: () => Promise<T>
  ): Promise<T> {
    const cache = APICache.getInstance();
    const cachedValue = cache.get<T>(key);

    if (cachedValue !== null) {
      return cachedValue;
    }

    const value = await fn();
    cache.set(key, value, ttlMs);
    return value;
  }
}
