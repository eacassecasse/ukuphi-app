import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: string;
      email: string;
      role: "ATTENDEE" | "ORGANIZER" | "ADMIN";
      name?: string;
    };
  }
}
