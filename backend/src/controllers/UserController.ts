import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/UserService";
import { validateWithZod } from "../utils/validation.zod";
import {
  CreateUserInput,
  schemas,
  UpdateUserBody,
  UpdateUserInput,
} from "../inputs/user.schema";
import { db } from "../lib/prisma";
import { NotificationService } from "../services/NotificationService";
import { sendMail } from "../lib/nodemailer";

export class UserController {
  static async registerHandler(
    request: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply
  ) {
    const body = validateWithZod(schemas.createUserSchema)(request.body);

    const user = await UserService.createUser(body);

    validateWithZod(schemas.createUserResponseSchema)(user);

    await UserService.generateAndSendOTP({
      id: user.id,
      email: user.email,
      phone: user.phone || "",
    });

    return reply.status(201).send(user);
  }

  static async updateHandler(
    request: FastifyRequest<{ Body: UpdateUserBody }>,
    reply: FastifyReply
  ) {
    const body = validateWithZod(schemas.updateUserCore)(request.body);

    const input = {
      id: request.user.id,
      ...body,
    };
    const user = await UserService.updateUser(input);

    validateWithZod(schemas.createUserResponseSchema)(user);

    return reply.status(200).send(user);
  }

  static async verifyOTPHandler(
    request: FastifyRequest<{ Body: { userId: string; otp: string } }>,
    reply: FastifyReply
  ) {
    const { userId, otp } = request.body;

    const user = await UserService.verifyOTP(userId, otp);

    await NotificationService.create(user.id, {
      message: "Your profile was successfully updated",
      type: "INFO",
      status: "UNREAD",
    });

    await sendMail(user.email, "Welcome Aboard! Your Account is Successfully Verified", "verification", {
      userName: user.name
    });

    return reply.status(200).send({ message: "OTP verified successfully" });
  }
}
