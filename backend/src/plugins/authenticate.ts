import { FastifyJWT } from "@fastify/jwt";
import fastify, { FastifyReply, FastifyRequest } from "fastify";

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
    const refreshToken = await generateRefreshToken(decoded as FastifyJWT["user"]);
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

export async function generateRefreshToken(user: FastifyJWT["user"]) {
  const refreshToken = fastify().jwt.sign(user, { expiresIn: '7d'});

  return refreshToken;
}

