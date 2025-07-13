import { FastifyInstance } from "fastify";
import { EventController } from "@modules/events/events.controller";
import { EventService } from "@modules/events/events.service";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { EventStatus } from "@prisma/client";
import { EventPaginatedResponseSchema } from "./events.schema";
export async function eventRoutes(fastify: FastifyInstance) {
  const eventService = new EventService();
  const controller = new EventController(eventService);

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/events",
    {
      schema: {
        querystring: zodToJsonSchema(
          z.object({
            page: z.number().int().positive().optional(),
            shard: z.number().int().nonnegative().optional(),
          })
        ),
        response: {
          200: zodToJsonSchema(EventPaginatedResponseSchema),
        },
      },
    },
    async (request) => {
      return controller.getEvents(request);
    }
  );
}
