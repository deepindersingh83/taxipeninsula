import "server-only";

/**
 * A small in-memory fixed-window rate limiter for the public form endpoints.
 *
 * LIMITATION: state lives in this process. On a single VPS that is exactly
 * right. On a multi-instance or serverless deployment each instance keeps its
 * own counter, so the effective limit is (limit × instances). reCAPTCHA is the
 * primary defence; this is a cheap second layer that stops one script hammering
 * one instance. If you later need a hard global limit, swap the Map for Redis —
 * the function signature does not need to change.
 */

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

// Stop the Map growing without bound on a long-running server.
const MAX_KEYS = 10_000;

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  if (buckets.size > MAX_KEYS) {
    for (const [k, v] of buckets) {
      if (v.resetAt <= now) buckets.delete(k);
    }
    // Still oversized after pruning expired entries: drop everything rather
    // than leak memory. Worst case a handful of clients get a fresh window.
    if (buckets.size > MAX_KEYS) buckets.clear();
  }

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  return {
    ok: true,
    remaining: limit - existing.count,
    retryAfterSeconds: 0,
  };
}

/** Best-effort client IP from the proxy headers Vercel/nginx/Cloudflare set. */
export function clientIp(headers: Headers) {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
