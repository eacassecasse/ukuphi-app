import { JWT } from "@fastify/jwt";

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
    user: {
      id: string;
      email: string;
      role: "ATTENDEE" | "ORGANIZER" | "ADMIN";
      name?: string;
    };
    optionalUser: {
      id: string;
      email: string;
      role: "ATTENDEE" | "ORGANIZER" | "ADMIN";
      name?: string;
    } | null;
    userRole?: "ATTENDEE" | "ORGANIZER" | "ADMIN";
    resource?: any;
    trackAuthFailure?: () => Promise<void>;
  }

  interface FastifyInstance {
    authenticate: any;
    optionalAuthenticate: any;
    verifyOwnership: any;
    verifyRole: any;
    verifyUserOwnership: any;
    verifyPostOwnership: any;
    verifyEventOwnership: any;
    requireAdmin: any;
    requireOrganizerOrAdmin: any;
    securityMiddleware: any;
    authRateLimit: any;
    apiRateLimit: any;
    publicRateLimit: any;
  }
}

