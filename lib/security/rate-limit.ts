import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory sliding window store
const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic garbage collection to prevent memory leaks (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

export interface RateLimitOptions {
  /** Maximum number of allowed requests in the time window */
  limit: number;
  /** Duration of the window in seconds */
  windowSec: number;
  /** Custom key prefix, e.g. "auth:login" or "api:checkin" */
  prefix?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Extracts client IP address safely from standard headers
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Checks and updates rate limit for a given request.
 */
export function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions
): RateLimitResult {
  const ip = getClientIp(req);
  const prefix = options.prefix || "global";
  const key = `${prefix}:${ip}`;
  const now = Date.now();
  const windowMs = options.windowSec * 1000;

  const current = rateLimitStore.get(key);

  if (!current || now > current.resetAt) {
    // New window
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitStore.set(key, newRecord);
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      reset: Math.ceil(newRecord.resetAt / 1000),
    };
  }

  if (current.count >= options.limit) {
    // Limit exceeded
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      reset: Math.ceil(current.resetAt / 1000),
    };
  }

  // Increment counter
  current.count += 1;
  return {
    success: true,
    limit: options.limit,
    remaining: options.limit - current.count,
    reset: Math.ceil(current.resetAt / 1000),
  };
}

/**
 * Helper to generate a 429 Too Many Requests response with standard headers
 */
export function createRateLimitResponse(result: RateLimitResult, customMessage?: string): NextResponse {
  const retryAfterSec = Math.max(1, result.reset - Math.ceil(Date.now() / 1000));
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: customMessage || `Trop de requêtes. Veuillez patienter ${retryAfterSec} seconde(s) avant de réessayer.`,
      },
    },
    {
      status: 429,
      headers: {
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(result.reset),
        "Retry-After": String(retryAfterSec),
      },
    }
  );
}
