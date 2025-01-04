import { CreateNotificationInput } from "../inputs/notification.schema";
import { db } from "../lib/prisma";
import BusinessError, { NotFoundError } from "../models/errors";
import { UserService } from "./UserService";

export class NotificationService {
  static async create(userId: string, input: CreateNotificationInput) {
    try {
      const notification = await db.notification.create({
        data: {
          ...input,
          sentAt: new Date(),
          userId,
        },
      });

      return notification;
    } catch (error) {
      throw new Error("Failed to create a notification");
    }
  }

  static async find(id: string) {
    const user = await UserService.findOne(id);

    const notifications = await db.notification.findMany({
      where: {
        userId: user.id,
      },
    });

    if (notifications.length === 0) {
      throw new NotFoundError("No notifications found for this user");
    }

    return notifications;
  }

  static async update(userId: string, input: { id: string }) {
    const { id } = input;

    const dbNotification = await db.notification.findUnique({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!dbNotification) {
      throw new NotFoundError("Notification not found");
    }

    if (dbNotification.status === 'READ') {
      throw new BusinessError("This notification has been read already.");
    }

    const notification = await db.notification.update({
      where: {
        id: dbNotification.id,
        userId,
      },
      data: {
        status: "READ",
      },
      select: {
        id: true,
        type: true,
        message: true,
        sentAt: true,
        status: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    return notification;
  }
}
