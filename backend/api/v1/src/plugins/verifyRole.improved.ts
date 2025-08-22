import {
  AuthError,
  ForbiddenError,
  NotFoundError,
} from "@/lib/errors/http/errors";
import { prismaClient } from "@/lib/prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { redis } from "@/lib/redis";

export type UserRole = "ATTENDEE" | "ORGANIZER" | "ADMIN";

interface Permission {
  resource: string;
  action: string;
  attributes?: string[];
}

interface RoleConfig {
  roles: UserRole[];
  permissions?: Permission[];
  requireAll?: boolean; // Require all roles vs any role
}

// Role hierarchy - higher roles inherit lower role permissions
const ROLE_HIERARCHY: Record<UserRole, number> = {
  ATTENDEE: 1,
  ORGANIZER: 2,
  ADMIN: 3,
};

// Role-based permissions matrix
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ATTENDEE: [
    { resource: "events", action: "read" },
    { resource: "tickets", action: "read" },
    { resource: "profile", action: "update", attributes: ["own"] },
  ],
  ORGANIZER: [
    { resource: "events", action: "create" },
    { resource: "events", action: "update", attributes: ["own"] },
    { resource: "venues", action: "read" },
    { resource: "posts", action: "create" },
  ],
  ADMIN: [
    { resource: "*", action: "*" }, // Full access
  ],
};

export function verifyRole(config: UserRole[] | RoleConfig) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user?.id) {
      throw new AuthError("User not authenticated");
    }

    const allowedRoles = Array.isArray(config) ? config : config.roles;
    const requireAll = Array.isArray(config) ? false : config.requireAll || false;

    // Get user role with caching
    const userRole = await getUserRole(request.user.id);
    
    if (!userRole) {
      throw new NotFoundError("User");
    }

    // Check role access
    const hasAccess = requireAll 
      ? allowedRoles.every(role => hasRoleAccess(userRole, role))
      : allowedRoles.some(role => hasRoleAccess(userRole, role));

    if (!hasAccess) {
      throw new ForbiddenError(`Access denied. Required roles: ${allowedRoles.join(", ")}`);
    }

    // Additional permission checks if specified
    if (!Array.isArray(config) && config.permissions) {
      const hasPermissions = await checkPermissions(userRole, config.permissions);
      if (!hasPermissions) {
        throw new ForbiddenError("Insufficient permissions");
      }
    }

    // Attach user role to request for further use
    request.userRole = userRole;
  };
}

async function getUserRole(userId: string): Promise<UserRole | null> {
  // Try cache first
  const cacheKey = `user_role:${userId}`;
  const cachedRole = await redis.get(cacheKey);
  
  if (cachedRole) {
    return cachedRole as UserRole;
  }

  // Fetch from database
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    return null;
  }

  // Cache for 15 minutes
  await redis.set(cacheKey, user.role, 900);
  
  return user.role as UserRole;
}

function hasRoleAccess(userRole: UserRole, requiredRole: UserRole): boolean {
  // Check role hierarchy - higher roles can access lower role features
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

async function checkPermissions(userRole: UserRole, requiredPermissions: Permission[]): Promise<boolean> {
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  
  // Admin has all permissions
  if (userRole === "ADMIN") {
    return true;
  }

  return requiredPermissions.every(required => {
    return userPermissions.some(permission => {
      return (
        (permission.resource === "*" || permission.resource === required.resource) &&
        (permission.action === "*" || permission.action === required.action)
      );
    });
  });
}

// Convenience functions for common role checks
export const requireAdmin = verifyRole(["ADMIN"]);
export const requireOrganizerOrAdmin = verifyRole(["ORGANIZER", "ADMIN"]);
export const requireAuthenticated = verifyRole(["ATTENDEE", "ORGANIZER", "ADMIN"]);

// Advanced permission-based access control
export function requirePermissions(permissions: Permission[]) {
  return verifyRole({
    roles: ["ATTENDEE", "ORGANIZER", "ADMIN"],
    permissions,
  });
}

// Resource-specific access control
export function verifyResourceAccess(resourceType: string, action: string = "read") {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userRole = request.userRole || await getUserRole(request.user.id);
    
    if (!userRole) {
      throw new AuthError("User role not found");
    }

    const hasAccess = await checkPermissions(userRole, [
      { resource: resourceType, action }
    ]);

    if (!hasAccess) {
      throw new ForbiddenError(`No ${action} access to ${resourceType}`);
    }
  };
}

// Clear user role cache when role changes
export async function invalidateUserRoleCache(userId: string): Promise<void> {
  await redis.delete(`user_role:${userId}`);
}
