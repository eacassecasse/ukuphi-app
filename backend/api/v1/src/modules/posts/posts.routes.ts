import { FastifyInstance } from "fastify";
import { PostController } from "../controllers/PostController";
import { TagController } from "../controllers/TagController";

export async function postRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    PostController.createHandler
  );

  fastify.get("/", PostController.listHandler);

  fastify.get("/:id", PostController.getHandler);

  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    PostController.updateHandler
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    PostController.deleteHandler
  );

  //TAGS
  fastify.post(
    "/:id/tags",
    {
      preHandler: [fastify.authenticate],
    },
    TagController.registerHandler
  );

  fastify.get("/:id/tags", TagController.listHandler);

  fastify.get("/:id/tags/:tagId", TagController.getHandler);

  fastify.delete(
    "/:id/tags/:tagd",
    {
      preHandler: [fastify.authenticate],
    },
    TagController.deleteHandler
  );

  //COMMENTS
  fastify.post(
    "/:id/comments",
    {
      preHandler: [fastify.authenticate],
    },
    PostController.commentHandler
  );

  fastify.get("/:id/comments", PostController.listCommentsHandler);
}
