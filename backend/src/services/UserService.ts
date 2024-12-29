import { CreateUserInput } from "../inputs/user.schema";
import { db } from "../lib/prisma";
import { hashPassword } from "../utils/utils";

export class UserService {
  static async findUserByEmail(email: string) {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
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
