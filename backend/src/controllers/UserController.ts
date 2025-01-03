import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/UserService";
import { validateWithZod } from "../utils/validation.zod";
import { CreateUserInput, schemas, UpdateUserInput } from "../inputs/user.schema";
import { db } from "../lib/prisma";

export class UserController {
  static async registerHandler(
    request: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply
  ) {
    const body = validateWithZod(schemas.createUserSchema)(request.body);

    try {
      const user = await UserService.createUser(body);

      validateWithZod(schemas.createUserResponseSchema)(user);

      const otp = await UserService.generateAndSendOTP({
        id: user.id,
        email: user.email,
        phone: user.phone || ""
      });

      console.log(`This OTP: ${otp} was send to the user`);

      return reply.status(201).send(user);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  static async updateHandler(
    request: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply
  ) {
    const body = validateWithZod(schemas.createUserSchema)(request.body);

    try {
      const input = {
        id: request.user.id,
        ...body
      }
      const user = await UserService.updateUser(input);

      validateWithZod(schemas.createUserResponseSchema)(user);

      return reply.status(200).send(user);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  static async verifyOTPHandler(
    request: FastifyRequest<{ Body: { userId: string; otp: string } }>,
    reply: FastifyReply
  ) {
    const { userId, otp } = request.body;

    try {
      const isValid = await UserService.verifyOTP(userId, otp);

      if (!isValid) {
        return reply.status(400).send({ message: "Invalid OTP" });
      }

      await db.user.update({
        where: { id: userId },
        data: { verified: true },
      });

      return reply.status(200).send({ message: "OTP verified successfully" });
    } catch (error: any) {
      console.log(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error.message,
      })
    }
  }
}