import { FastifyRequest, FastifyReply } from "fastify";
import { redis } from "@/lib/redis";
import { AuthError, ForbiddenError } from "@/lib/errors/http/errors";

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (request: FastifyRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  message?: string;
}

interface SecurityConfig {
  rateLimit?: RateLimitConfig;
  requireHttps?: boolean;
  blockSuspiciousRequests?: boolean;
  logSecurityEvents?: boolean;
}

export function securityMiddleware(config: SecurityConfig = {}) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const {
      rateLimit,
      requireHttps = process.env.NODE_ENV === "production",
      blockSuspiciousRequests = true,
      logSecurityEvents = true,
    } = config;

    // Enforce HTTPS in production
    if (requireHttps && request.protocol !== "https") {
      throw new ForbiddenError("HTTPS required");
    }

    // Rate limiting
    if (rateLimit) {
      await enforceRateLimit(request, reply, rateLimit);
    }

    // Block suspicious requests
    if (blockSuspiciousRequests) {
      await detectSuspiciousActivity(request, reply, logSecurityEvents);
    }

    // Add security headers
    reply.headers({
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    });
  };
}

async function enforceRateLimit(
  request: FastifyRequest,
  reply: FastifyReply,
  config: RateLimitConfig
) {
  const {
    windowMs,
    maxRequests,
    keyGenerator = (req) => req.ip,
    message = "Too many requests",
  } = config;

  const key = `rate_limit:${keyGenerator(request)}`;
  const window = Math.floor(Date.now() / windowMs);
  const windowKey = `${key}:${window}`;

  try {
    const requests = await redis.incr(windowKey);
    
    if (requests === 1) {
      await redis.expire(windowKey, Math.ceil(windowMs / 1000));
    }

    if (requests > maxRequests) {
      const retryAfter = Math.ceil(windowMs / 1000);
      reply.headers({
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": maxRequests.toString(),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": (Date.now() + retryAfter * 1000).toString(),
      });
      
      throw new ForbiddenError(message);
    }

    // Add rate limit headers
    reply.headers({
      "X-RateLimit-Limit": maxRequests.toString(),
      "X-RateLimit-Remaining": Math.max(0, maxRequests - requests).toString(),
    });

  } catch (error) {
    if (error instanceof ForbiddenError) {
      throw error;
    }
    // If Redis fails, allow the request but log the error
    console.error("Rate limiting error:", error);
  }
}

async function detectSuspiciousActivity(
  request: FastifyRequest,
  reply: FastifyReply,
  logEvents: boolean
) {
  const suspiciousPatterns = [
    // SQL injection patterns
    /('|(\\x27)|(\\x2D)|(\\x2d)|(\%27)|(\%2D)|(\%2d))/i,
    /(union|select|insert|update|delete|drop|create|alter|exec|execute)/i,
    
    // XSS patterns
    /(<script|javascript:|vbscript:|onload=|onerror=)/i,
    
    // Path traversal
    /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\\)/i,
    
    // Command injection
    /(;|\||&|`|\$\(|\${)/,
  ];

  const userAgent = request.headers["user-agent"] || "";
  const url = request.url;
  const body = JSON.stringify(request.body || {});

  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(url) || pattern.test(body) || pattern.test(userAgent)
  );

  if (isSuspicious) {
    if (logEvents) {
      console.warn("Suspicious request detected:", {
        ip: request.ip,
        userAgent,
        url,
        method: request.method,
        timestamp: new Date().toISOString(),
      });
    }

    // Block the request
    throw new ForbiddenError("Request blocked for security reasons");
  }

  // Check for unusual request patterns
  await checkRequestPatterns(request, logEvents);
}

async function checkRequestPatterns(request: FastifyRequest, logEvents: boolean) {
  const ip = request.ip;
  const now = Date.now();
  const patterns = {
    rapidRequests: { window: 60000, threshold: 100 }, // 100 requests in 1 minute
    authFailures: { window: 300000, threshold: 10 },   // 10 auth failures in 5 minutes
  };

  // Check for rapid requests from same IP
  const rapidKey = `pattern:rapid:${ip}`;
  const rapidCount = await redis.incr(rapidKey);
  
  if (rapidCount === 1) {
    await redis.expire(rapidKey, Math.ceil(patterns.rapidRequests.window / 1000));
  }

  if (rapidCount > patterns.rapidRequests.threshold) {
    if (logEvents) {
      console.warn("Rapid request pattern detected:", { ip, count: rapidCount });
    }
    throw new ForbiddenError("Request rate too high");
  }

  // Track auth failures
  if (request.url.includes("/auth/") && request.method === "POST") {
    const authKey = `pattern:auth_fail:${ip}`;
    
    // This would be called after authentication fails
    request.trackAuthFailure = async () => {
      const failures = await redis.incr(authKey);
      if (failures === 1) {
        await redis.expire(authKey, Math.ceil(patterns.authFailures.window / 1000));
      }
      
      if (failures > patterns.authFailures.threshold) {
        // Temporarily block IP
        await redis.setex(`blocked:${ip}`, 3600, "auth_failures"); // 1 hour block
      }
    };
  }

  // Check if IP is currently blocked
  const isBlocked = await redis.get(`blocked:${ip}`);
  if (isBlocked) {
    throw new ForbiddenError("IP temporarily blocked due to suspicious activity");
  }
}

// Predefined rate limiting configurations
export const rateLimitConfigs = {
  // Strict rate limiting for auth endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 login attempts per 15 minutes
    keyGenerator: (req: FastifyRequest) => `auth:${req.ip}`,
    message: "Too many authentication attempts",
  },

  // Standard API rate limiting
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    keyGenerator: (req: FastifyRequest) => req.user?.id || req.ip,
  },

  // Strict rate limiting for resource creation
  creation: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 creation requests per minute
    keyGenerator: (req: FastifyRequest) => `create:${req.user?.id || req.ip}`,
    message: "Too many creation requests",
  },

  // Public endpoint rate limiting
  public: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 200, // 200 requests per minute
    keyGenerator: (req: FastifyRequest) => req.ip,
  },
};

// Convenience middleware functions
export const authRateLimit = securityMiddleware({
  rateLimit: rateLimitConfigs.auth,
  blockSuspiciousRequests: true,
});

export const apiRateLimit = securityMiddleware({
  rateLimit: rateLimitConfigs.api,
  blockSuspiciousRequests: true,
});

export const publicRateLimit = securityMiddleware({
  rateLimit: rateLimitConfigs.public,
  blockSuspiciousRequests: false,
});

export const creationRateLimit = securityMiddleware({
  rateLimit: rateLimitConfigs.creation,
  blockSuspiciousRequests: true,
});
