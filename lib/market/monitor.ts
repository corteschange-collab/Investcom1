/**
 * Lightweight monitoring for the market data pipeline.
 *
 * In production you'd forward these events to a service like Sentry,
 * Datadog, or Axiom. For now they're accumulated in-process and exposed
 * via /api/market/status so you can inspect them in dev.
 */

export type EventSeverity = "info" | "warn" | "error";

export interface MonitorEvent {
  id: number;
  ts: number;
  severity: EventSeverity;
  source: string;
  message: string;
  data?: unknown;
}

class MarketMonitor {
  private events: MonitorEvent[] = [];
  private counter = 0;

  /** Keep only the most recent N events in memory. */
  private readonly MAX_EVENTS = 200;

  private push(severity: EventSeverity, source: string, message: string, data?: unknown): void {
    this.events.push({ id: ++this.counter, ts: Date.now(), severity, source, message, data });
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }

    // Mirror to console for dev visibility
    const prefix = `[market:${source}]`;
    if (severity === "error") console.error(prefix, message, data ?? "");
    else if (severity === "warn") console.warn(prefix, message, data ?? "");
    else console.log(prefix, message);
  }

  info(source: string, message: string, data?: unknown) {
    this.push("info", source, message, data);
  }

  warn(source: string, message: string, data?: unknown) {
    this.push("warn", source, message, data);
  }

  error(source: string, message: string, data?: unknown) {
    this.push("error", source, message, data);
  }

  /** Returns all events, optionally filtered by severity. */
  getEvents(severity?: EventSeverity): MonitorEvent[] {
    if (!severity) return [...this.events];
    return this.events.filter((e) => e.severity === severity);
  }

  /** Summary metrics for /api/market/status. */
  summary() {
    const last5min = Date.now() - 5 * 60_000;
    const recent = this.events.filter((e) => e.ts > last5min);
    return {
      totalEvents: this.events.length,
      recentErrors: recent.filter((e) => e.severity === "error").length,
      recentWarns: recent.filter((e) => e.severity === "warn").length,
      lastError: this.events.filter((e) => e.severity === "error").at(-1) ?? null,
      lastEvents: this.events.slice(-10).reverse(),
    };
  }
}

export const monitor = new MarketMonitor();

/** Decorator-style wrapper: times a fetch and logs success/failure. */
export async function trackedFetch<T>(
  source: string,
  label: string,
  fn: () => Promise<T>
): Promise<{ data: T | null; durationMs: number; error: string | null }> {
  const start = Date.now();
  try {
    const data = await fn();
    const durationMs = Date.now() - start;
    monitor.info(source, `${label} completed in ${durationMs}ms`);
    return { data, durationMs, error: null };
  } catch (err) {
    const durationMs = Date.now() - start;
    const message = err instanceof Error ? err.message : String(err);
    monitor.error(source, `${label} failed after ${durationMs}ms: ${message}`);
    return { data: null, durationMs, error: message };
  }
}
