import { CreateEventCommentInput } from "../inputs/comment.schema";
import { CreateEventInput, UpdateEventInput } from "../inputs/event.schema";
import { db } from "../lib/prisma";
import { NotFoundError } from "../models/errors";
import { UserService } from "./UserService";

export class EventService {
  static async find() {
    const events = await db.event.findMany({});

    if (events.length === 0) {
      throw new NotFoundError("No events found");
    }

    return events;
  }

  static async findEventsByOrganizer(id: string) {
    const organizer = await UserService.findOne(id);

    const events = await db.event.findMany({
      where: {
        organizerId: organizer.id,
      },
    });

    if (events.length === 0) {
      throw new NotFoundError("No events found for the organizer");
    }

    return events;
  }

  static async findOne(id: string) {
    const event = await db.event.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        date: true,
        image_url: true,
        tickets_sold: true,
        organizer: true,
      },
    });

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    return event;
  }

  static async createEvent(id: string, input: CreateEventInput) {
    const { date, ...rest } = input;

    const event = await db.event.create({
      data: {
        ...rest,
        date: new Date(date.replace(" ", "T")),
        organizerId: id,
      },
    });

    return event;
  }

  static async updateEvent(id: string, input: UpdateEventInput) {
    const { date, ...rest } = input;

    const dbEvent = await db.event.findUnique({
      where: {
        id: input.id,
        organizerId: id,
      },
    });

    if (!dbEvent) {
      throw new NotFoundError("Event not found");
    }

    const updatedData = {
      ...(input.title ? { title: input.title } : {}),
      ...(input.description ? { description: input.description } : {}),
      ...(input.date ? { date: new Date(input.date.replace(" ", "T")) } : {}),
      ...(input.image_url ? { image_url: input.image_url } : {}),
      ...(input.location ? { location: input.location } : {}),
    };

    const event = await db.event.update({
      where: {
        id: dbEvent.id,
        organizerId: id,
      },
      data: updatedData,
    });

    return event;
  }

  static async deleteEvent(organizerId: string, id: string) {
    const event = await db.event.findUnique({
      where: {
        id,
        organizerId,
      },
    });

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    await db.event.delete({
      where: { id: event.id },
    });
  }

  static async comment(id: string, input: CreateEventCommentInput) {
    const event = await EventService.findOne(input.event_id);

    const comment = await db.comment.create({
      data: {
        title: input.title,
        content: input.content,
        commentedAt: new Date(),
        userId: id,
        event_comments: {
          create: {
            eventId: event.id,
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
        event_comments: {
          select: {
            event: {
              select: {
                id: true,
                title: true,
                description: true,
                location: true,
                date: true
              }
            }
          }
        }
      },
    });

    return comment;
  }

  static async listComments(eventId: string) {
    const comments = await db.event_Comment.findMany({
      where: {
        eventId,
      },
      select: {
        comment: {
          select: {
            id: true,
            title: true,
            content: true,
            commentedAt: true,
          },
        },event: {
          select: {
            id: true,
            title: true,
            description: true,
            location: true,
            date: true
          }
        }
      },
    });

    if (comments.length === 0) {
      throw new NotFoundError("No comments found");
    }

    return comments;
  }
}
