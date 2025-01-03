import { JWT } from "@fastify/jwt";

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
    optionalUser: {
      id: string;
      email: string;
      role: string;
    } | null;
  }

  export interface FastifyInstance {
    authenticate: any;
  }
}
