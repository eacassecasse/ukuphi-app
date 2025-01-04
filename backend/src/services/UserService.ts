import { CreateUserInput, UpdateUserInput } from "../inputs/user.schema";
import { db } from "../lib/prisma";
import { redis } from "../lib/redis";
import BusinessError, { NotFoundError } from "../models/errors";
import { hashPassword } from "../utils/bcrypt";
import { sendOTP } from "../utils/otp";
import { generate6DigitsNumber } from "../utils/utils";

export class UserService {
  static async findUserByEmail(email: string) {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  static async findOne(id: string) {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        verified: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
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
      throw new BusinessError("User already exists");
    }

    const user = await db.user.create({
      data: { ...rest, role: userRole, password: hashedPassword },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        verified: true,
      },
    });

    await db.notification.create({
      data: {
        message: "Welcome to Ukuphi App! We're glad to have you.",
        type: "WELCOME",
        status: "UNREAD",
        userId: user.id,
        sentAt: new Date(),
      },
    });

    return user;
  }

  static async updateUser(input: UpdateUserInput) {
    const { password, role, ...rest } = input;

    const dbUser = await db.user.findUnique({
      where: { id: input.id },
    });
    if (!dbUser) {
      throw new NotFoundError("User not found");
    }

    const updatedData = {
      ...(input.name ? { name: input.name } : {}),
      ...(input.email ? { email: input.email } : {}),
      ...(input.phone ? { phone: input.phone } : {}),
      ...(input.password
        ? { password: await hashPassword(input.password) }
        : {}),
      ...(input.role ? { role: input.role.toLocaleUpperCase() } : {}),
    };

    const user = await db.user.update({
      where: { id: dbUser.id },
      data: updatedData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        verified: true,
      },
    });

    await db.notification.create({
      data: {
        message: "Your profile has been successfully update.",
        type: "UPDATE",
        status: "UNREAD",
        userId: user.id,
        sentAt: new Date(),
      },
    });

    return user;
  }

  static async getUser(id: string) {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  static async deleteUser(id: string) {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    await db.user.delete({
      where: { id: user.id },
    });
  }

  static async generateAndSendOTP(user: {
    id: string;
    email: string;
    phone: string;
  }) {
    const otp = generate6DigitsNumber().toString();
    const ttl = 300;

    await redis.connect();
    await redis.set(`otp:${user.id}`, otp, ttl);

    const target = user.email || user.phone;
    const method = user.email ? "email" : "phone";

    await sendOTP(target, otp, method);
  }

  static async verifyOTP(userId: string, otp: string) {
    const otpKey = `otp:${userId}`;
    const storedOtp = await redis.get(otpKey);

    if (!storedOtp || storedOtp !== otp) {
      throw new BusinessError("Invalid OTP");
    }

    const user = await db.user.update({
      where: { id: userId },
      data: { verified: true },
    });

    await redis.delete(otpKey); // Remove the OTP after successful verification

    return user;
  }
}
