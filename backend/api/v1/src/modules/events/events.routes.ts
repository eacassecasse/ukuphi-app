import { FastifyInstance } from "fastify";
import { EventController } from "@modules/events/events.controller";
import { EventService } from "@modules/events/events.service";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { PaginationSchema } from "@/lib/schemas/schemas.utils";
export async function eventRoutes(fastify: FastifyInstance) {
  const eventService = new EventService();
  const controller = new EventController(eventService);

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/events",
    {
      schema: {
        querystring: PaginationSchema,
      },
    },
    async (request) => {
      return controller.getEvents(request);
    }
  );
}
