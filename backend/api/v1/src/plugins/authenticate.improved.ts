import { FastifyJWT } from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
import { AuthError } from "@/lib/errors/http/errors";
import { redis } from "@/lib/redis";
import { ZodError } from "zod/v4";

interface AuthenticateOptions {
  optional?: boolean;
  refreshCookie?: boolean;
}

export function authenticate(options: AuthenticateOptions = {}) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;

    // Handle optional authentication
    if (options.optional && (!authHeader || !authHeader.startsWith("Bearer "))) {
      request.optionalUser = null;
      return;
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthError("Missing or invalid authorization header");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AuthError("Missing token");
    }

    try {
      // Check if token is blacklisted
      const isBlacklisted = await isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new AuthError("Token has been revoked");
      }

      const decoded = request.jwt.verify(token) as FastifyJWT["user"];

      // Validate token payload
      if (!decoded.id || !decoded.email || !decoded.role) {
        throw new AuthError("Invalid token payload");
      }

      request.user = decoded;

      // Optionally set refresh cookie only when needed
      if (options.refreshCookie) {
        const refreshToken = await generateRefreshToken(request, decoded);
        setSecureCookie(reply, "refresh_token", refreshToken);
      }

    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }

      // Handle JWT specific errors
      if (error instanceof ZodError) {
        if (error.message.includes("expired")) {
          throw new AuthError("Token has expired");
        } else if (error.message.includes("invalid")) {
          throw new AuthError("Invalid token");
        }
      }

      throw new AuthError("Authentication failed");
    }
  };
}

export async function generateRefreshToken(
  request: FastifyRequest,
  user: FastifyJWT["user"]
): Promise<string> {
  const refreshTokenExpiration = process.env.JWT_REFRESH_TOKEN_EXPIRATION || "7d";

  const refreshToken = request.jwt.sign(user, {
    expiresIn: refreshTokenExpiration,
  });

  // Store refresh token in Redis with expiration
  const tokenKey = `refresh_token:${user.id}:${Date.now()}`;
  await redis.set(tokenKey, refreshToken, getExpirationSeconds(refreshTokenExpiration));

  return refreshToken;
}

export async function blacklistToken(token: string): Promise<void> {
  try {
    // Decode token to get expiration
    const decoded = require("jsonwebtoken").decode(token) as any;
    if (decoded && decoded.exp) {
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await redis.set(`blacklist:${token}`, "revoked", ttl);
      }
    }
  } catch (error) {
    // If we can't decode, blacklist for default time
    await redis.set(`blacklist:${token}`, "revoked", 86400); // 24 hours
  }
}

async function isTokenBlacklisted(token: string): Promise<boolean> {
  const result = await redis.get(`blacklist:${token}`);
  return result === "revoked";
}

function setSecureCookie(reply: FastifyReply, name: string, value: string): void {
  reply.setCookie(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

function getExpirationSeconds(expiration: string): number {
  // Convert JWT expiration format to seconds
  const match = expiration.match(/(\d+)([dhms])/);
  if (!match) return 604800; // Default 7 days

  const [, num, unit] = match;
  const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
  type Unit = keyof typeof multipliers;
  const safeUnit = unit as Unit;
  return parseInt(num) * (multipliers[safeUnit] || 86400);
}

// Enhanced optional authentication for public endpoints
export const optionalAuthenticate = authenticate({ optional: true });

// Standard authentication with refresh token generation
export const authenticateWithRefresh = authenticate({ refreshCookie: true });
