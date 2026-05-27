/**
 * Token-bucket rate limiter for external API calls.
 *
 * Brapi free tier: 15 requests / minute.
 * We use 13/min (leave 2 as buffer) for safety.
 *
 * If a request would exceed the limit, callers must decide:
 *   - Return stale cached data (preferred)
 *   - Wait and retry after `retryAfterMs`
 *   - Return an error
 */

interface RateLimiterOptions {
  maxRequests: number;
  windowMs: number;
  name: string;
}

export class RateLimiter {
  private timestamps: number[] = [];
  private readonly max: number;
  private readonly windowMs: number;
  readonly name: string;

  constructor({ maxRequests, windowMs, name }: RateLimiterOptions) {
    this.max = maxRequests;
    this.windowMs = windowMs;
    this.name = name;
  }

  private evict(): void {
    const cutoff = Date.now() - this.windowMs;
    this.timestamps = this.timestamps.filter((t) => t > cutoff);
  }

  /** Returns true and records the request if within limit. */
  tryConsume(): boolean {
    this.evict();
    if (this.timestamps.length >= this.max) return false;
    this.timestamps.push(Date.now());
    return true;
  }

  /** Returns true if a request can be made right now. */
  canRequest(): boolean {
    this.evict();
    return this.timestamps.length < this.max;
  }

  remaining(): number {
    this.evict();
    return Math.max(0, this.max - this.timestamps.length);
  }

  /** Ms until the oldest in-window request expires (i.e., when quota refills). */
  retryAfterMs(): number {
    this.evict();
    if (this.timestamps.length < this.max) return 0;
    const oldest = this.timestamps[0];
    return Math.max(0, oldest + this.windowMs - Date.now());
  }

  stats() {
    this.evict();
    return {
      name: this.name,
      used: this.timestamps.length,
      remaining: this.remaining(),
      retryAfterMs: this.retryAfterMs(),
      windowMs: this.windowMs,
      maxRequests: this.max,
    };
  }
}

/** Shared limiter instances — one per external API. */
export const brapiLimiter = new RateLimiter({
  name: "brapi",
  maxRequests: 13, // 13/min out of 15 allowed (buffer of 2)
  windowMs: 60_000,
});

export const yahooLimiter = new RateLimiter({
  name: "yahoo",
  maxRequests: 30, // Yahoo has no official limit; be conservative
  windowMs: 60_000,
});

export const bcbLimiter = new RateLimiter({
  name: "bcb",
  maxRequests: 10,
  windowMs: 60_000,
});
