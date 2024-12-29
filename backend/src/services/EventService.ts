import { CreateUserInput } from "../inputs/user.schema";
import { db } from "../lib/prisma";

export class EventService {
  static async find() {
    const events = await db.event.findMany({});

    return events;
  }

  static async findEventsByOrganizer(id: string) {
    const organizer = await db.user.findMany({
      where: {
        id
      }
    })

    if (!organizer) {
      throw new Error
    }
  }

  static async createUser(input: CreateUserInput) {
    const { password, role, ...rest } = input;
    const hashedPassword = await hashPassword(password);
    const userRole = role?.toLocaleUpperCase() ?? "ATTENDEE";

    const dbUser = await db.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (dbUser) {
      throw new Error("User already exists");
    }

    const user = await db.user.create({
      data: { ...rest, role: userRole, password: hashedPassword },
    });

    return user;
  }
}
