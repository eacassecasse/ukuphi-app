import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../users/users.service";
import { LoginInput } from "./auth.schema";
import { verifyPassword } from "@/utils/bcrypt";
import { generateRefreshToken } from "@/plugins/authenticate";
import { FastifyJWT } from "@fastify/jwt";

export class AuthController {
  static async loginHandler(
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
  ) {
    const body = request.body;

    const user = await UserService.findUserByEmail(body.email);

    if (
      !user ||
      !verifyPassword({
        candidatePassword: body.password,
        hash: user.password,
      })
    ) {
      return reply.status(401).send({
        message: "Unauthorized",
      });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = request.jwt.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    });

    const refresh_token = await generateRefreshToken(request, payload);

    reply.setCookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    reply.setCookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return { access_token: token, refresh_token };
  }

  static async refreshTokenHandler(
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
  ) {
    const refresh = request.cookies.refresh_token;

    if (!refresh) {
      return reply.status(401).send({
        message: "Refresh token missing",
      });
    }

    const decoded = await fastify().jwt.verify(refresh);

    const newAccessToken = request.jwt.sign(decoded, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    });
    const newRefreshToken = await generateRefreshToken(
      request,
      decoded as FastifyJWT["user"]
    );

    reply.setCookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    reply.setCookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return { access_token: newAccessToken, refresh_token: newRefreshToken };
  }

  static async logoutHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie("access_token");
    reply.clearCookie("refresh_token");

    return reply.status(204).send();
  }
}
