import { z } from "zod";
import { UserRoleSchema } from "@lib/schemas/schemas.enums";

// Permission definition
export const PermissionSchema = z.object({
  resource: z.string(),
  action: z.enum(["create", "read", "update", "delete", "manage"]),
  attributes: z.array(z.string()).default(["*"]),
});

// Role permissions
export const RolePermissionsSchema = z.object({
  role: UserRoleSchema,
  permissions: z.array(PermissionSchema),
});

// Access control
export const AccessControlSchema = z.object({
  resource: z.string(),
  action: z.string(),
  attributes: z.array(z.string()),
});
