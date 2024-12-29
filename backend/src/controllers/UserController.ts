import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/UserService";
import { validateWithZod } from "../utils/utils";
import { CreateUserInput, schemas } from "../inputs/user.schema";

export class UserController {
  static async registerHandler(
    request: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply
  ) {
    const body = validateWithZod(schemas.createUserSchema)(request.body);

    try {
      const user = await UserService.createUser(body);

      validateWithZod(schemas.createUserResponseSchema)(user);

      return reply.status(201).send(user);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }
}
