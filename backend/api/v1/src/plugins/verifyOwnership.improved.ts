import { prismaClient } from "@/lib/prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  AuthError,
  ForbiddenError,
  NotFoundError,
} from "@/lib/errors/http/errors";

interface OwnershipConfig {
  resourceType: string;
  idParam?: string;
  ownerField?: string;
  allowRoles?: string[];
  customCheck?: (resource: any, user: any) => boolean;
}

export function verifyOwnership(config: string | OwnershipConfig = "user") {
  return async (
    request: FastifyRequest<{ Params: Record<string, string> }>,
    reply: FastifyReply
  ) => {
    if (!request.user?.id) {
      throw new AuthError("User not authenticated");
    }

    const ownershipConfig = typeof config === "string" 
      ? { resourceType: config, idParam: "id", ownerField: "id", allowRoles: ["ADMIN"] }
      : {
          idParam: "id",
          ownerField: "userId",
          allowRoles: ["ADMIN"],
          ...config
        };

    const { resourceType, idParam, ownerField, allowRoles, customCheck } = ownershipConfig;
    const resourceId = request.params[idParam];

    if (!resourceId) {
      throw new ForbiddenError(`Missing ${idParam} parameter`);
    }

    // Admin override (unless explicitly disabled)
    if (allowRoles?.includes(request.user.role)) {
      return;
    }

    try {
      const resource = await getResource(resourceType, resourceId);

      if (!resource) {
        throw new NotFoundError(capitalizeFirst(resourceType));
      }

      // Custom ownership check
      if (customCheck) {
        if (!customCheck(resource, request.user)) {
          throw new ForbiddenError("Access denied to this resource");
        }
        return;
      }

      // Standard ownership check
      const ownerId = resource[ownerField];
      
      if (!ownerId) {
        throw new ForbiddenError(`Resource does not have ownership information`);
      }

      if (ownerId !== request.user.id) {
        throw new ForbiddenError("You can only access your own resources");
      }

      // Attach resource to request for further use
      request.resource = resource;

    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ForbiddenError) {
        throw error;
      }
      throw new NotFoundError(capitalizeFirst(resourceType));
    }
  };
}

async function getResource(resourceType: string, id: string): Promise<any> {
  const modelMap: Record<string, any> = {
    user: prismaClient.user,
    post: prismaClient.post,
    event: prismaClient.event,
    venue: prismaClient.venue,
    order: prismaClient.order,
    notification: prismaClient.notification,
    // Add more models as needed
  };

  const model = modelMap[resourceType.toLowerCase()];
  
  if (!model) {
    throw new Error(`Unknown resource type: ${resourceType}`);
  }

  return await model.findUnique({
    where: { id },
  });
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Convenience functions for common ownership patterns
export const verifyUserOwnership = verifyOwnership({
  resourceType: "user",
  idParam: "id",
  ownerField: "id",
});

export const verifyPostOwnership = verifyOwnership({
  resourceType: "post",
  idParam: "id",
  ownerField: "authorId",
});

export const verifyEventOwnership = verifyOwnership({
  resourceType: "event",
  idParam: "id",
  ownerField: "organizerId",
});

export const verifyOrderOwnership = verifyOwnership({
  resourceType: "order",
  idParam: "id",
  ownerField: "userId",
});

// Multi-level ownership (e.g., comment ownership through post ownership)
export function verifyNestedOwnership(config: {
  resourceType: string;
  parentType: string;
  parentIdParam: string;
  parentOwnerField: string;
}) {
  return async (
    request: FastifyRequest<{ Params: Record<string, string> }>,
    reply: FastifyReply
  ) => {
    if (!request.user?.id) {
      throw new AuthError("User not authenticated");
    }

    // Admin override
    if (request.user.role === "ADMIN") {
      return;
    }

    const { resourceType, parentType, parentIdParam, parentOwnerField } = config;
    const parentId = request.params[parentIdParam];

    if (!parentId) {
      throw new ForbiddenError(`Missing ${parentIdParam} parameter`);
    }

    try {
      const parentResource = await getResource(parentType, parentId);
      
      if (!parentResource) {
        throw new NotFoundError(capitalizeFirst(parentType));
      }

      const ownerId = parentResource[parentOwnerField];
      
      if (ownerId !== request.user.id) {
        throw new ForbiddenError(`You can only access ${resourceType}s for your own ${parentType}s`);
      }

    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ForbiddenError) {
        throw error;
      }
      throw new NotFoundError(capitalizeFirst(parentType));
    }
  };
}

// For comments on posts: verify user owns the post
export const verifyCommentOwnership = verifyNestedOwnership({
  resourceType: "comment",
  parentType: "post",
  parentIdParam: "postId",
  parentOwnerField: "authorId",
});

// For event tickets: verify user owns the event
export const verifyTicketOwnership = verifyNestedOwnership({
  resourceType: "ticket",
  parentType: "event", 
  parentIdParam: "eventId",
  parentOwnerField: "organizerId",
});
