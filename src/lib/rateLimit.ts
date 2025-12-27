// Simple in-memory rate limiting for development
// For production, consider using @upstash/ratelimit with Redis

const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(
  identifier: string,
  maxRequests = 10,
  windowMs = 10000
): { success: boolean; remaining: number } {
  const now = Date.now();
  const requests = rateLimitMap.get(identifier) || [];
  const recentRequests = requests.filter((time) => now - time < windowMs);

  if (recentRequests.length >= maxRequests) {
    return { success: false, remaining: 0 };
  }

  recentRequests.push(now);
  rateLimitMap.set(identifier, recentRequests);
  return { success: true, remaining: maxRequests - recentRequests.length };
}

// Clean up old entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    const windowMs = 10000;
    for (const [key, requests] of rateLimitMap.entries()) {
      const recentRequests = requests.filter((time) => now - time < windowMs);
      if (recentRequests.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, recentRequests);
      }
    }
  }, 60000); // Clean up every minute
}
