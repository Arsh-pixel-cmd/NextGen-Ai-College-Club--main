/**
 * Client-side Rate Limiter
 * Implements a sliding window rate limiter to throttle sensitive operations
 * (e.g. admin logins, form submissions, repeated API triggers) and prevent abuse.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

/**
 * Checks whether an action keyed by `key` is allowed within the rate limit window.
 *
 * @param key Unique identifier for the action (e.g. "admin-login:ip" or "contact-form")
 * @param maxAttempts Maximum allowed attempts in the window (default: 5)
 * @param windowMs Time window in milliseconds (default: 60,000 ms / 1 minute)
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(key) || { timestamps: [] };

  // Filter out timestamps outside the active window
  const activeTimestamps = record.timestamps.filter((time) => now - time < windowMs);

  if (activeTimestamps.length >= maxAttempts) {
    const oldest = activeTimestamps[0];
    const retryAfterMs = Math.max(0, windowMs - (now - oldest));
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs,
    };
  }

  // Record this attempt
  activeTimestamps.push(now);
  rateLimitStore.set(key, { timestamps: activeTimestamps });

  return {
    allowed: true,
    remaining: maxAttempts - activeTimestamps.length,
    retryAfterMs: 0,
  };
}

/**
 * Clears recorded attempts for a given rate limit key (e.g. after successful login).
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Higher-order helper to wrap an asynchronous action with rate limiting protection.
 */
export async function withRateLimit<T>(
  key: string,
  maxAttempts: number,
  windowMs: number,
  action: () => Promise<T>
): Promise<T> {
  const limit = checkRateLimit(key, maxAttempts, windowMs);
  if (!limit.allowed) {
    const waitSeconds = Math.ceil(limit.retryAfterMs / 1000);
    throw new Error(
      `Too many attempts. Please slow down and try again in ${waitSeconds} second${
        waitSeconds === 1 ? '' : 's'
      }.`
    );
  }
  return action();
}
