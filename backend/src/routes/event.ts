import { FastifyInstance } from "fastify";
import { EventController } from "../controllers/EventController";
import { FastifyJWT } from "@fastify/jwt";
import { generateRefreshToken } from "../plugins/authenticate";
import { TicketController } from "../controllers/TicketController";

export async function eventRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    EventController.registerHandler
  );

  fastify.get(
    "/",
    {
      preHandler: [
        async (request, reply) => {
          const authHeader = request.headers.authorization;

          if (authHeader) {
            const token = authHeader.split(" ")[1];

            try {
              const decoded = request.jwt.verify(token);
              const refreshToken = await generateRefreshToken(
                request,
                decoded as FastifyJWT["user"]
              );

              reply.setCookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
              });
              request.user = decoded as FastifyJWT["user"];
            } catch (error) {
              return reply.status(401).send({
                message: "Unauthorized",
              });
            }
          }
        },
      ],
    },
    EventController.listHandler
  );

  fastify.get("/:id", EventController.getHandler);

  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    EventController.updateHandler
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    EventController.deleteHandler
  );

  //TICKETS
  fastify.post(
    "/:id/tickets",
    {
      preHandler: [fastify.authenticate],
    },
    TicketController.registerHandler
  );

  fastify.get(
    "/:id/tickets",
    TicketController.listHandler
  );

  fastify.get("/:id/tickets/:ticketId", TicketController.getHandler);

  fastify.put(
    "/:id/tickets/:ticketId",
    {
      preHandler: [fastify.authenticate],
    },
    TicketController.updateHandler
  );

  fastify.delete(
    "/:id/tickets/:ticketId",
    {
      preHandler: [fastify.authenticate],
    },
    TicketController.deleteHandler
  );

  //COMMENTS
  fastify.post(
    "/:id/comments",
    {
      preHandler: [fastify.authenticate],
    },
    EventController.commentHandler
  );

  fastify.get(
    "/:id/comments",
    EventController.listCommentsHandler
  );
}
