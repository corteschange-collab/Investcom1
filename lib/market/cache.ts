/**
 * In-memory TTL cache for server-side market data.
 *
 * Scope: single Node.js process. In a serverless deployment each function
 * instance gets its own cache — resets on cold start, but Next.js fetch()
 * cache is the durable layer. This acts as a request-deduplication barrier
 * that prevents hammering Brapi multiple times within the same TTL window.
 *
 * For production scale: swap `store` Map for an Upstash Redis client.
 */

export type DataSource = "brapi" | "yahoo" | "bcb" | "cache" | "stale" | "fallback";

export interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
  /** How long this entry is considered fresh (ms) */
  ttlMs: number;
  source: DataSource;
}

export interface CachedResult<T> {
  data: T;
  meta: {
    fetchedAt: number;
    ageMs: number;
    stale: boolean;
    source: DataSource;
  };
}

class MarketDataCache {
  private store = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, data: T, ttlMs: number, source: DataSource = "brapi"): void {
    this.store.set(key, { data, fetchedAt: Date.now(), ttlMs, source });
  }

  /** Returns entry regardless of staleness (callers decide what to do). */
  get<T>(key: string): CacheEntry<T> | undefined {
    return this.store.get(key) as CacheEntry<T> | undefined;
  }

  isFresh(key: string): boolean {
    const e = this.store.get(key);
    if (!e) return false;
    return Date.now() - e.fetchedAt < e.ttlMs;
  }

  isStale(key: string): boolean {
    const e = this.store.get(key);
    if (!e) return true;
    return Date.now() - e.fetchedAt >= e.ttlMs;
  }

  /** Returns data with freshness metadata, or null if never fetched. */
  getWithMeta<T>(key: string): CachedResult<T> | null {
    const e = this.store.get(key) as CacheEntry<T> | undefined;
    if (!e) return null;
    const ageMs = Date.now() - e.fetchedAt;
    return {
      data: e.data,
      meta: { fetchedAt: e.fetchedAt, ageMs, stale: ageMs >= e.ttlMs, source: e.source },
    };
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  /** Remove all keys whose prefix matches pattern (e.g. "quote:"). */
  deleteByPrefix(prefix: string): number {
    let n = 0;
    for (const k of this.store.keys()) {
      if (k.startsWith(prefix)) { this.store.delete(k); n++; }
    }
    return n;
  }

  /** Evict entries that are older than 2× their TTL to reclaim memory. */
  purge(): number {
    let n = 0;
    const now = Date.now();
    for (const [k, e] of this.store.entries()) {
      if (now - e.fetchedAt > e.ttlMs * 2) { this.store.delete(k); n++; }
    }
    return n;
  }

  stats() {
    return {
      size: this.store.size,
      keys: [...this.store.keys()],
      entries: [...this.store.entries()].map(([k, e]) => ({
        key: k,
        source: e.source,
        ageMs: Date.now() - e.fetchedAt,
        stale: Date.now() - e.fetchedAt >= e.ttlMs,
      })),
    };
  }
}

/** Singleton — one cache per server process. */
export const marketCache = new MarketDataCache();

// Schedule periodic purge (only fires if module is loaded in a long-lived process)
if (typeof setInterval !== "undefined") {
  setInterval(() => marketCache.purge(), 5 * 60_000); // every 5 min
}
