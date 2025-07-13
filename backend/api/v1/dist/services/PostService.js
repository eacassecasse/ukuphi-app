"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const prisma_1 = require("../lib/prisma");
const errors_1 = require("../models/errors");
const UserService_1 = require("./UserService");
class PostService {
    static async find() {
        const posts = await prisma_1.db.post.findMany({});
        if (posts.length === 0) {
            throw new errors_1.NotFoundError("No post found");
        }
        return posts;
    }
    static async findEventsByAuthor(id) {
        const author = await UserService_1.UserService.findOne(id);
        const posts = await prisma_1.db.post.findMany({
            where: {
                authorId: author.id,
            },
        });
        if (posts.length === 0) {
            throw new errors_1.NotFoundError("No posts found for the author");
        }
        return posts;
    }
    static async findOne(id) {
        const post = await prisma_1.db.post.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                content: true,
                featured_image: true,
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!post) {
            throw new errors_1.NotFoundError("Post not found");
        }
        return post;
    }
    static async createPost(id, input) {
        const post = await prisma_1.db.post.create({
            data: {
                ...input,
                publishedAt: new Date(),
                authorId: id,
            },
            select: {
                id: true,
                title: true,
                content: true,
                featured_image: true,
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        await prisma_1.db.notification.create({
            data: {
                message: "You have published a new post.",
                type: "INFO",
                status: "UNREAD",
                userId: id,
                sentAt: new Date(),
            },
        });
        return post;
    }
    static async updatePost(userId, input) {
        const { id, ...rest } = input;
        const dbPost = await prisma_1.db.post.findUnique({
            where: {
                id: input.id,
                authorId: userId,
            },
        });
        if (!dbPost) {
            throw new errors_1.NotFoundError("Post not found");
        }
        const updatedData = {
            ...(input.title ? { title: input.title } : {}),
            ...(input.content ? { content: input.content } : {}),
            ...(input.featured_image ? { featured_image: input.featured_image } : {}),
        };
        const post = await prisma_1.db.post.update({
            where: {
                id: dbPost.id,
                authorId: userId,
            },
            data: updatedData,
            select: {
                id: true,
                title: true,
                content: true,
                featured_image: true,
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return post;
    }
    static async deletePost(authorId, id) {
        const post = await prisma_1.db.post.findUnique({
            where: {
                id,
                authorId,
            },
        });
        if (!post) {
            throw new errors_1.NotFoundError("Post not found");
        }
        await prisma_1.db.post.delete({
            where: { id: post.id },
        });
    }
    static async comment(id, input) {
        const post = await PostService.findOne(input.post_id);
        const comment = await prisma_1.db.comment.create({
            data: {
                title: input.title,
                content: input.content,
                commentedAt: new Date(),
                userId: id,
                post_comments: {
                    create: {
                        postId: post.id,
                    },
                },
            },
            select: {
                id: true,
                title: true,
                content: true,
                commentedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                post_comments: {
                    select: {
                        post: {
                            select: {
                                id: true,
                                title: true,
                                publishedAt: true,
                            },
                        },
                    },
                },
            },
        });
        return comment;
    }
    static async listComments(postId) {
        const comments = await prisma_1.db.post_Comment.findMany({
            where: {
                postId,
            },
            select: {
                comment: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        commentedAt: true,
                    },
                },
                post: {
                    select: {
                        id: true,
                        title: true,
                        publishedAt: true,
                    },
                },
            },
        });
        if (comments.length === 0) {
            throw new errors_1.NotFoundError("No comments found");
        }
        return comments;
    }
}
exports.PostService = PostService;
