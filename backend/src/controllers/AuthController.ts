import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/UserService";
import { verifyPassword } from "../utils/bcrypt";
import { LoginInput } from "../inputs/auth.schema";
import { generateRefreshToken } from "../plugins/authenticate";
import { FastifyJWT } from "@fastify/jwt";
import { NotificationService } from "../services/NotificationService";

export class AuthController {
  static async loginHandler(
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
  ) {
    const body = request.body;

    const user = await UserService.findUserByEmail(body.email);

    if (!user) {
      return reply.status(401).send({
        message: "Invalid email address. Try again!",
      });
    }

    const isValidPassword = verifyPassword({
      candidatePassword: body.password,
      hash: user.password,
    });

    if (!isValidPassword) {
      return reply.status(401).send({
        message: "Password is incorrect",
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = request.jwt.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    });

    const refreshToken = await generateRefreshToken(request, payload);

    reply.setCookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    await NotificationService.create(user.id, {
      message: "New login detected from a new device/location",
      type: "WARNING",
      status: "UNREAD"
    });

    return { accessToken: token, refreshToken };
  }

  static async refreshTokenHandler(
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
  ) {
    const refreshToken = request.cookies.refresh_token;

    if (!refreshToken) {
      return reply.status(401).send({
        message: "Refresh token missing",
      });
    }

    const decoded = await fastify().jwt.verify(refreshToken);

    const newAccessToken = request.jwt.sign(decoded, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    });
    const newRefreshToken = await generateRefreshToken(
      request,
      decoded as FastifyJWT["user"]
    );

    reply.setCookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return { accessToken: newAccessToken, refreshToken };
  }

  static async logoutHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie("access_token");
    reply.clearCookie("refresh_token");

    return reply.status(200).send({ message: "Logged out successfully" });
  }
}
