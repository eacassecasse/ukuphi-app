import { FastifyReply, FastifyRequest } from "fastify";
import { validateWithZod } from "../utils/validation.zod";
import { CreateTagInput, schemas } from "../inputs/tag.schema";
import { TagService } from "../services/TagsService";

export class TagController {
  static async registerHandler(
    request: FastifyRequest<{ Params: { id: string }; Body: CreateTagInput }>,
    reply: FastifyReply
  ) {
    if (request.user.role !== "ORGANIZER") {
      return reply.status(403).send({
        message: "Not authorized",
      });
    }

    const body = validateWithZod(schemas.tagCore)(request.body);

    try {
      const { id } = request.params;
      if (!id) {
        return reply.status(400).send({
          message: "Missing ID param",
        });
      }

      const tag = await TagService.addTag(request.user.id, {
        post_id_id: id,
        ...body,
      });

      await validateWithZod(schemas.createTagResponseSchema)(tag);

      return reply.status(201).send(tag);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  static async listHandler(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;

      if (!id) {
        return reply.status(400).send({
          message: "Missing ID param",
        });
      }
      const tags = await TagService.find(id);

      if (!tags || tags.length === 0) {
        return reply.status(404).send({
          message: "No tag found for this post",
        });
      }

      return reply.status(200).send(tags);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error.message || error,
      });
    }
  }

  static async getHandler(
    request: FastifyRequest<{ Params: { id: string; tagId: string } }>,
    reply: FastifyReply
  ) {
    const { id, tagId } = request.params;

    if (!id) {
      return reply.status(400).send({
        message: "Missing ID param",
      });
    }

    if (!tagId) {
      return reply.status(400).send({
        message: "Missing Tag ID param",
      });
    }

    try {
      const tag = await TagService.findOne(id, tagId);

      await validateWithZod(schemas.createTagResponseSchema)(tag);

      return reply.status(200).send(tag);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  static async deleteHandler(
    request: FastifyRequest<{ Params: { id: string; tagId: string } }>,
    reply: FastifyReply
  ) {
    if (request.user.role !== "ORGANIZER") {
      return reply.status(403).send({
        message: "Not authorized",
      });
    }

    const { id, tagId } = request.params;

    if (!id) {
      return reply.status(400).send({
        message: "Missing ID param",
      });
    }

    if (!tagId) {
      return reply.status(400).send({
        message: "Missing Tag ID param",
      });
    }

    try {
      await TagService.removeTag(request.user.id, {
        post_id: id,
        tag_id: tagId,
      });

      return reply.status(204).send();
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }
}