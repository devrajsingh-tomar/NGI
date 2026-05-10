/**
 * Simple In-Memory Rate Limiter for Server Actions
 * Note: This resets on server restart/hot-reload.
 * For production, consider using Redis.
 */

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const store: RateLimitStore = {};

interface RateLimitOptions {
    limit: number;      // Max requests in the window
    windowMs: number;  // Window duration in milliseconds
}

export function isRateLimited(identifier: string, options: RateLimitOptions): boolean {
    const now = Date.now();
    const record = store[identifier];

    if (!record || now > record.resetTime) {
        // Create new record or reset expired one
        store[identifier] = {
            count: 1,
            resetTime: now + options.windowMs,
        };
        return false;
    }

    // Increment count
    record.count += 1;

    // Check if limit exceeded
    if (record.count > options.limit) {
        return true;
    }

    return false;
}

/**
 * Standard configurations for different types of actions
 */
export const RATE_LIMIT_CONFIGS = {
    AUTH: { limit: 5, windowMs: 1 * 60 * 1000 },      // 5 attempts per minute
    UPLOAD: { limit: 10, windowMs: 5 * 60 * 1000 },   // 10 uploads per 5 minutes
    SENSITIVE: { limit: 15, windowMs: 1 * 60 * 1000 }, // 15 requests per minute
};
