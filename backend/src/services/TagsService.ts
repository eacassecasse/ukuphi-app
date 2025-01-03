import { db } from "../lib/prisma";
import { PostService } from "./PostService";
import { CreateTagInput } from "../inputs/tag.schema";
import { NotFoundError } from "../models/errors";

export class TagService {
  static async find(postId: string) {
    const tags = await db.tag.findMany({
      where: {
        postId,
      },
    });

    if (tags.length === 0) {
      throw new NotFoundError("No tags found");
    }

    return tags;
  }

  static async findOne(id: string, tagId: string) {

    const post = await PostService.findOne(id);

    const tag = await db.tag.findUnique({
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
      throw new NotFoundError("Tag not found");
    }

    return tag;
  }

  static async addTag(id: string, input: CreateTagInput) {
    const { post_id, ...rest } = input;

    const post = await db.post.findUnique({
      where: {
        id: post_id,
        authorId: id,
      },
    });

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    const tag = await db.tag.create({
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

  static async removeTag(
    id: string,
    params: { post_id: string; tag_id: string }
  ) {
    const post = await db.post.findUnique({
      where: {
        id: params.post_id,
        authorId: id,
      },
    });

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    await db.tag.delete({
      where: { id: params.tag_id, postId: post.id },
    });
  }
}
