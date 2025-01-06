"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
const prisma_1 = require("../lib/prisma");
const PostService_1 = require("./PostService");
const errors_1 = require("../models/errors");
class TagService {
    static async find(postId) {
        const tags = await prisma_1.db.tag.findMany({
            where: {
                postId,
            },
        });
        if (tags.length === 0) {
            throw new errors_1.NotFoundError("No tags found");
        }
        return tags;
    }
    static async findOne(id, tagId) {
        const post = await PostService_1.PostService.findOne(id);
        const tag = await prisma_1.db.tag.findUnique({
            where: {
                id: tagId,
                postId: post.id
            },
            select: {
                id: true,
                content: true,
                post: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        featured_image: true,
                        publishedAt: true
                    }
                }
            }
        });
        if (!tag) {
            throw new errors_1.NotFoundError("Tag not found");
        }
        return tag;
    }
    static async addTag(id, input) {
        const { post_id, ...rest } = input;
        const post = await prisma_1.db.post.findUnique({
            where: {
                id: post_id,
                authorId: id,
            },
        });
        if (!post) {
            throw new errors_1.NotFoundError("Post not found");
        }
        const tag = await prisma_1.db.tag.create({
            data: {
                postId: post.id,
                ...rest,
            },
            select: {
                id: true,
                content: true,
                post: {
                    select: {
                        id: true,
                        title: true,
                        featured_image: true,
                        publishedAt: true
                    }
                }
            }
        });
        return tag;
    }
    static async removeTag(id, params) {
        const post = await prisma_1.db.post.findUnique({
            where: {
                id: params.post_id,
                authorId: id,
            },
        });
        if (!post) {
            throw new errors_1.NotFoundError("Post not found");
        }
        await prisma_1.db.tag.delete({
            where: { id: params.tag_id, postId: post.id },
        });
    }
}
exports.TagService = TagService;
