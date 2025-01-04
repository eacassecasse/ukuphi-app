import { FastifyJWT } from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.status(401).send({
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = request.jwt.verify(token);
    const refreshToken = await generateRefreshToken(
      request,
      decoded as FastifyJWT["user"]
    );

    reply.setCookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    request.user = decoded as FastifyJWT["user"];
  } catch (error) {
    return reply.status(401).send({
      message: "Unauthorized",
    });
  }
}

export async function generateRefreshToken(
  request: FastifyRequest,
  user: FastifyJWT["user"]
) {
  const refreshToken = request.jwt.sign(user, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
  });

  return refreshToken;
}
