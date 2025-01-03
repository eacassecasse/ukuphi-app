import { FastifyReply, FastifyRequest } from "fastify";
import { validateWithZod } from "../utils/validation.zod";
import { schemas as commentSchema, CreateCommentInput } from "../inputs/comment.schema";
import { PostService } from "../services/PostService";
import { redis } from "../lib/redis";
import { schemas, CreatePostInput, CreatePostResponse, UpdatePostInput } from "../inputs/post.schema";

export class PostController {
  static async createHandler(
    request: FastifyRequest<{ Body: CreatePostInput }>,
    reply: FastifyReply
  ) {
    if (request.user.role === "ATTENDEE") {
      return reply.status(403).send({
        message: "Not authorized",
      });
    }

    const body = validateWithZod(schemas.createPostSchema)(request.body);

    try {
      const post = await PostService.createPost(request.user.id, body);

      const response: CreatePostResponse = {
        ...post,
        published_at: post.publishedAt.toISOString().replace("T", " ").split(".")[0],
      }


      return reply.status(201).send(response);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  static async listHandler(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user

    try {
      await redis.connect();

      const cacheKey = 'posts-cached';
      const cached = await redis.get(cacheKey);

      if (cached) {
        return reply.status(200).send(JSON.parse(cached));
      }

      const posts = await PostService.find();

      if (!posts || posts.length === 0) {
        return reply.status(404).send({
          message: "No posts found",
        });
      }

      await redis.set(cacheKey, JSON.stringify(posts), 3600);

      return reply.status(200).send(posts);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error.message || error,
      });
    }
  }

  static async getHandler(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {

    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({
        message: "Missing ID param",
      });
    }

    try {
      await redis.connect();
      const cacheKey = `posts:${id}`;
      const cached = await redis.get(cacheKey);

      if (cached) {
        return reply.status(200).send(JSON.parse(cached));
      }

      const post = await PostService.findOne(id);

      const response: CreatePostResponse = {
        ...post,
        published_at: post.publishedAt.toISOString().replace("T", " ").split(".")[0],
      }

      await redis.set(cacheKey, JSON.stringify(response), 3600);

      return reply.status(200).send(response);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  static async updateHandler(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdatePostInput }>,
    reply: FastifyReply
  ) {
    if (request.user.role === "ATTENDEE") {
      return reply.status(403).send({
        message: "Not authorized",
      });
    }

    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({
        message: "Missing ID param",
      });
    }

    const body = validateWithZod(schemas.createPostSchema)(request.body);

    try {
      const input = {
        id,
        ...body,
      };
      const post = await PostService.updatePost(request.user.id, body);

      const response: CreatePostResponse = {
        ...post,
        published_at: post.publishedAt.toISOString().replace("T", " ").split(".")[0],
      }

      return reply.status(200).send(response);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  static async deleteHandler(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    if (request.user.role === "ATTENDEE") {
      return reply.status(403).send({
        message: "Not authorized",
      });
    }

    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({
        message: "Missing ID param",
      });
    }

    try {
      await PostService.deletePost(request.user.id, id);

      return reply.status(204).send();
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  static async commentHandler(
        request: FastifyRequest<{ Params: {id: string}; Body: CreateCommentInput }>,
        reply: FastifyReply
      ) {
    
        const body = validateWithZod(commentSchema.createCommentSchema)(request.body);
    
        try {
          const { id } = request.params
          if (!id) {
            return reply.status(400).send({
              message: "Missing ID param"
            })
          }
  
          const input = {
            post_id: id,
            ...body
          }
    
          const comment = await PostService.comment(request.user.id, input);
    
          await validateWithZod(commentSchema.createPostCommentResponseSchema)(comment);
    
    
          return reply.status(201).send(comment);
        } catch (error: any) {
          console.error(error);
          reply.status(500).send({
            message: "Internal Server Error",
            error: error,
          });
        }
      }
    
      static async listCommentsHandler(
        request: FastifyRequest<{ Params: { id: string }}>,
        reply: FastifyReply) {
    
        try {
          const { id } = request.params
    
          if (!id) {
            return reply.status(400).send({
              message: "Missing ID param"
            })
          }
          const comments = await PostService.listComments(id);
    
          if (!comments || comments.length === 0) {
            return reply.status(404).send({
              message: "No comment found for this post",
            });
          }
    
          return reply.status(200).send(comments);
        } catch (error: any) {
          console.error(error);
          reply.status(500).send({
            message: "Internal Server Error",
            error: error.message || error,
          });
        }
      }
}
