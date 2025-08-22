import BusinessError, { NotFoundError } from "@/lib/errors/http/errors";
import { db } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { hashPassword } from "@/utils/bcrypt";
import { sendOTP } from "@/utils/otp";
import { generate6DigitsNumber } from "@/utils/utils";
import {
  CreateUserRequestBody,
  UpdateUserRequestBody,
  VerificationStatusSchema,
} from "@/modules/users/users.schema";

export class AuthService {
  static async register(data: CreateUserRequestBody) {
    return db.user.create({
      data: {
        ...data,
        password: hashPassword(data.password),
        accountCredit: 0.0,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

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
      throw new NotFoundError("User");
    }

    return user;
  }

  static async findById(id: string) {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        verificationStatus: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  static async update(id: string, data: UpdateUserRequestBody) {
    return db.user.update({
      where: {
        id,
      },
      data: data.password
        ? {
            ...data,
            password: hashPassword(data.password),
          }
        : data,
      select: {
        name: true,
        email: true,
      },
    });
  }

  static async updateVerification(id: string, status: string) {
    await db.user.update({
      where: { id },
      data: {
        verificationStatus: status,
      },
    });
  }

  static async deleteUser(id: string) {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundError("User");
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
      data: { verificationStatus: "PHONE_VERIFIED" },
    });

    await redis.delete(otpKey); // Remove the OTP after successful verification

    return user;
  }
}
