"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const validation_zod_1 = require("../utils/validation.zod");
const comment_schema_1 = require("../inputs/comment.schema");
const PostService_1 = require("../services/PostService");
const redis_1 = require("../lib/redis");
const post_schema_1 = require("../inputs/post.schema");
const NotificationService_1 = require("../services/NotificationService");
class PostController {
    static async createHandler(request, reply) {
        if (request.user.role === "ATTENDEE") {
            return reply.status(403).send({
                message: "Not authorized",
            });
        }
        const body = (0, validation_zod_1.validateWithZod)(post_schema_1.schemas.createPostSchema)(request.body);
        const post = await PostService_1.PostService.createPost(request.user.id, body);
        const response = {
            ...post,
            published_at: post.publishedAt
                .toISOString()
                .replace("T", " ")
                .split(".")[0],
        };
        await NotificationService_1.NotificationService.create(request.user.id, {
            message: `A new post ${post.id} was successfully created.`,
            type: "INFO",
            status: "UNREAD"
        });
        return reply.status(201).send(response);
    }
    static async listHandler(request, reply) {
        await redis_1.redis.connect();
        const cacheKey = "posts-cached";
        const cached = await redis_1.redis.get(cacheKey);
        if (cached) {
            return reply.status(200).send(JSON.parse(cached));
        }
        const posts = await PostService_1.PostService.find();
        if (!posts || posts.length === 0) {
            return reply.status(404).send({
                message: "No posts found",
            });
        }
        await redis_1.redis.set(cacheKey, JSON.stringify(posts), 3600);
        return reply.status(200).send(posts);
    }
    static async getHandler(request, reply) {
        const { id } = request.params;
        if (!id) {
            return reply.status(400).send({
                message: "Missing ID param",
            });
        }
        await redis_1.redis.connect();
        const cacheKey = `posts:${id}`;
        const cached = await redis_1.redis.get(cacheKey);
        if (cached) {
            return reply.status(200).send(JSON.parse(cached));
        }
        const post = await PostService_1.PostService.findOne(id);
        const response = {
            ...post,
            published_at: post.publishedAt
                .toISOString()
                .replace("T", " ")
                .split(".")[0],
        };
        await redis_1.redis.set(cacheKey, JSON.stringify(response), 3600);
        return reply.status(200).send(response);
    }
    static async updateHandler(request, reply) {
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
        const body = (0, validation_zod_1.validateWithZod)(post_schema_1.schemas.updatePostCore)(request.body);
        const input = {
            id,
            ...body,
        };
        const post = await PostService_1.PostService.updatePost(request.user.id, input);
        const response = {
            ...post,
            published_at: post.publishedAt
                .toISOString()
                .replace("T", " ")
                .split(".")[0],
        };
        await NotificationService_1.NotificationService.create(request.user.id, {
            message: `Post ${post.id} was successfully updated.`,
            type: "INFO",
            status: "UNREAD"
        });
        return reply.status(200).send(response);
    }
    static async deleteHandler(request, reply) {
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
        await PostService_1.PostService.deletePost(request.user.id, id);
        await NotificationService_1.NotificationService.create(request.user.id, {
            message: `Post ${id} was successfully deleted.`,
            type: "WARNING",
            status: "UNREAD"
        });
        return reply.status(204).send();
    }
    static async commentHandler(request, reply) {
        const body = (0, validation_zod_1.validateWithZod)(comment_schema_1.schemas.createCommentSchema)(request.body);
        const { id } = request.params;
        if (!id) {
            return reply.status(400).send({
                message: "Missing ID param",
            });
        }
        const input = {
            post_id: id,
            ...body,
        };
        const comment = await PostService_1.PostService.comment(request.user.id, input);
        await (0, validation_zod_1.validateWithZod)(comment_schema_1.schemas.createPostCommentResponseSchema)(comment);
        await NotificationService_1.NotificationService.create(request.user.id, {
            message: `Post ${id} has a new comment.`,
            type: "INFO",
            status: "UNREAD"
        });
        return reply.status(201).send(comment);
    }
    static async listCommentsHandler(request, reply) {
        const { id } = request.params;
        if (!id) {
            return reply.status(400).send({
                message: "Missing ID param",
            });
        }
        const comments = await PostService_1.PostService.listComments(id);
        if (!comments || comments.length === 0) {
            return reply.status(404).send({
                message: "No comment found for this post",
            });
        }
        return reply.status(200).send(comments);
    }
}
exports.PostController = PostController;
