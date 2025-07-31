/**
 * Security utilities for the contact form
 */

// Security headers for API responses
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Robots-Tag': 'noindex, nofollow',
} as const;

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 5; // Maximum requests per window
const RATE_LIMIT_CLEANUP_INTERVAL = 10 * 60 * 1000; // Clean up every 10 minutes

// In-memory rate limiting store (for production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; windowStart: number }>();

/**
 * Simple rate limiter implementation
 */
export class RateLimiter {
  private store: Map<string, { count: number; windowStart: number }>;
  private maxRequests: number;
  private windowSize: number;

  constructor(maxRequests = RATE_LIMIT_MAX_REQUESTS, windowSize = RATE_LIMIT_WINDOW) {
    this.store = rateLimitStore;
    this.maxRequests = maxRequests;
    this.windowSize = windowSize;

    // Set up periodic cleanup
    this.setupCleanup();
  }

  /**
   * Check if request is allowed for given identifier
   */
  isAllowed(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = this.store.get(identifier);

    if (!record) {
      // First request from this identifier
      this.store.set(identifier, { count: 1, windowStart: now });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowSize,
      };
    }

    // Check if we're in a new window
    if (now - record.windowStart >= this.windowSize) {
      // New window, reset counter
      this.store.set(identifier, { count: 1, windowStart: now });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowSize,
      };
    }

    // Same window, check if limit exceeded
    if (record.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.windowStart + this.windowSize,
      };
    }

    // Increment counter
    record.count++;
    this.store.set(identifier, record);

    return {
      allowed: true,
      remaining: this.maxRequests - record.count,
      resetTime: record.windowStart + this.windowSize,
    };
  }

  /**
   * Get current rate limit status for identifier
   */
  getStatus(identifier: string): { count: number; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = this.store.get(identifier);

    if (!record || now - record.windowStart >= this.windowSize) {
      return {
        count: 0,
        remaining: this.maxRequests,
        resetTime: now + this.windowSize,
      };
    }

    return {
      count: record.count,
      remaining: Math.max(0, this.maxRequests - record.count),
      resetTime: record.windowStart + this.windowSize,
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, record] of this.store.entries()) {
      if (now - record.windowStart >= this.windowSize) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.store.delete(key));
  }

  /**
   * Setup periodic cleanup
   */
  private setupCleanup(): void {
    setInterval(() => {
      this.cleanup();
    }, RATE_LIMIT_CLEANUP_INTERVAL);
  }
}

// Global rate limiter instance
export const contactFormRateLimiter = new RateLimiter();

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  // Check various headers for the real IP
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  if (xForwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return xForwardedFor.split(',')[0].trim();
  }

  if (xRealIp) {
    return xRealIp;
  }

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to a default value
  return 'unknown';
}

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(status: {
  count: number;
  remaining: number;
  resetTime: number;
}) {
  return {
    'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
    'X-RateLimit-Remaining': status.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(status.resetTime / 1000).toString(),
    'X-RateLimit-Used': status.count.toString(),
  };
}

/**
 * Sanitize string for safe JSON serialization
 * More robust than manual escaping
 */
export function sanitizeForJSON(value: string): string {
  if (!value) return '';

  // Remove or replace potentially problematic characters
  return value
    .trim()
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, '') // Remove control characters
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/"/g, '\\"') // Escape quotes
    .replace(/\n/g, '\\n') // Escape newlines
    .replace(/\r/g, '\\r') // Escape carriage returns
    .replace(/\t/g, '\\t'); // Escape tabs
}

/**
 * Check for spam keywords in message
 */
export function containsSpamKeywords(message: string, keywords: readonly string[]): boolean {
  const lowercaseMessage = message.toLowerCase();
  return keywords.some((keyword) => lowercaseMessage.includes(keyword));
}

/**
 * Validate request origin
 */
export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://moura.ar',
    'https://www.moura.ar',
    'http://localhost:4321', // Development
    'http://localhost:4322', // Alternative dev port
    'http://localhost:4323', // Alternative dev port
    'http://localhost:3000', // Alternative dev port
    'http://localhost:3001', // Alternative dev port
  ];

  // In development, allow localhost and local network IPs
  if (origin) {
    // Allow localhost on any port
    if (origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:')) {
      return true;
    }

    // Allow local network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x) on development ports
    const localNetworkPattern =
      /^https?:\/\/(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}):(3000|3001|4321|4322|4323)$/;
    if (localNetworkPattern.test(origin)) {
      return true;
    }
  }

  return origin ? allowedOrigins.includes(origin) : false;
}

/**
 * Create secure response with headers
 */
export function createSecureResponse(
  body: string,
  status: number,
  additionalHeaders: Record<string, string> = {}
): Response {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...SECURITY_HEADERS,
      ...additionalHeaders,
    },
  });
}
