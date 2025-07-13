import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateUserRequestBody,
  UpdateUserRequestBody,
  VerificationStatusRequestBody,
} from "./users.schema";
import { UserService } from "./users.service";
import { sendMail } from "@/lib/nodemailer";
import { validateWithZod } from "@/utils/validation.zod";

export class UserController {
  static async createHandler(
    request: FastifyRequest<{ Body: CreateUserRequestBody }>,
    reply: FastifyReply
  ) {
    const user = await UserService.create(request.body);

    // await UserService.generateAndSendOTP({
    //   id: user.id,
    //   email: user.email,
    //   phone: "", // Update afterwards
    // });

    return reply.status(201).send(user);
  }

  static async getHandler(request: FastifyRequest) {
    return UserService.findById(request.user.id);
  }

  static async updateHandler(
    request: FastifyRequest<{
      Body: UpdateUserRequestBody;
      Params: { id: string };
    }>
  ) {
    return UserService.update(request.params.id, request.body);
  }

  static async verifyHandler(
    request: FastifyRequest<{
      Body: { status: VerificationStatusRequestBody };
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    const user = await UserService.updateVerification(
      request.params.id,
      request.body.status
    );

    // await sendMail(
    //   user.email,
    //   "Welcome Aboard! Your Account is Successfully Verified",
    //   "verification",
    //   {
    //     userName: user.name,
    //   }
    // );

    return reply.status(204).send();
  }
}
