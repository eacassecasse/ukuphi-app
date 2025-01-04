import { CreatePostCommentInput } from "../inputs/comment.schema";
import { CreatePostInput, UpdatePostInput } from "../inputs/post.schema";
import { db } from "../lib/prisma";
import { NotFoundError } from "../models/errors";
import { UserService } from "./UserService";

export class PostService {
  static async find() {
    const posts = await db.post.findMany({});

    if (posts.length === 0) {
      throw new NotFoundError("No post found");
    }

    return posts;
  }

  static async findEventsByAuthor(id: string) {
    const author = await UserService.findOne(id);

    const posts = await db.post.findMany({
      where: {
        authorId: author.id,
      },
    });

    if (posts.length === 0) {
      throw new NotFoundError("No posts found for the author");
    }

    return posts;
  }

  static async findOne(id: string) {
    const post = await db.post.findUnique({
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
      throw new NotFoundError("Post not found");
    }

    return post;
  }

  static async createPost(id: string, input: CreatePostInput) {
    const post = await db.post.create({
      data: {
        ...input,
        publishedAt: new Date(),
        authorId: id,
        location: "",
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

    await db.notification.create({
      data: {
        message: "You have published a new post.",
        type: "NEW_POST",
        status: "UNREAD",
        userId: id,
        sentAt: new Date(),
      },
    });

    return post;
  }

  static async updatePost(userId: string, input: UpdatePostInput) {
    const { id, ...rest } = input;

    const dbPost = await db.post.findUnique({
      where: {
        id: input.id,
        authorId: userId,
      },
    });

    if (!dbPost) {
      throw new NotFoundError("Post not found");
    }

    const updatedData = {
      ...(input.title ? { title: input.title } : {}),
      ...(input.content ? { content: input.content } : {}),
      ...(input.featured_image ? { featured_image: input.featured_image } : {}),
    };

    const post = await db.post.update({
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

  static async deletePost(authorId: string, id: string) {
    const post = await db.post.findUnique({
      where: {
        id,
        authorId,
      },
    });

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    await db.post.delete({
      where: { id: post.id },
    });
  }

  static async comment(id: string, input: CreatePostCommentInput) {
    const post = await PostService.findOne(input.post_id);

    const comment = await db.comment.create({
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
      },
    });

    return comment;
  }

  static async listComments(postId: string) {
    const comments = await db.post_Comment.findMany({
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
      },
    });

    if (comments.length === 0) {
      throw new NotFoundError("No comments found");
    }

    return comments;
  }
}
