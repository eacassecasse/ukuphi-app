"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagController = void 0;
const validation_zod_1 = require("../utils/validation.zod");
const tag_schema_1 = require("../inputs/tag.schema");
const TagsService_1 = require("../services/TagsService");
const redis_1 = require("../lib/redis");
class TagController {
    static async registerHandler(request, reply) {
        if (request.user.role === "ATTENDEE") {
            return reply.status(403).send({
                message: "Not authorized",
            });
        }
        const body = (0, validation_zod_1.validateWithZod)(tag_schema_1.schemas.tagCore)(request.body);
        const { id } = request.params;
        if (!id) {
            return reply.status(400).send({
                message: "Missing ID param",
            });
        }
        const tag = await TagsService_1.TagService.addTag(request.user.id, {
            post_id_id: id,
            ...body,
        });
        await (0, validation_zod_1.validateWithZod)(tag_schema_1.schemas.createTagResponseSchema)(tag);
        return reply.status(201).send(tag);
    }
    static async listHandler(request, reply) {
        const { id } = request.params;
        if (!id) {
            return reply.status(400).send({
                message: "Missing ID param",
            });
        }
        await redis_1.redis.connect();
        const cacheKey = `posts-${id}-tags-cached`;
        const cached = await redis_1.redis.get(cacheKey);
        if (cached) {
            return reply.status(200).send(JSON.parse(cached));
        }
        const tags = await TagsService_1.TagService.find(id);
        if (!tags || tags.length === 0) {
            return reply.status(404).send({
                message: "No tag found for this post",
            });
        }
        await redis_1.redis.set(cacheKey, JSON.stringify(tags), 3600);
        return reply.status(200).send(tags);
    }
    static async getHandler(request, reply) {
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
        await redis_1.redis.connect();
        const cacheKey = `posts-${id}-tags:${tagId}`;
        const cached = await redis_1.redis.get(cacheKey);
        if (cached) {
            return reply.status(200).send(JSON.parse(cached));
        }
        const tag = await TagsService_1.TagService.findOne(id, tagId);
        await (0, validation_zod_1.validateWithZod)(tag_schema_1.schemas.createTagResponseSchema)(tag);
        await redis_1.redis.set(cacheKey, JSON.stringify(tag), 3600);
        return reply.status(200).send(tag);
    }
    static async deleteHandler(request, reply) {
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
        await TagsService_1.TagService.removeTag(request.user.id, {
            post_id: id,
            tag_id: tagId,
        });
        return reply.status(204).send();
    }
}
exports.TagController = TagController;
