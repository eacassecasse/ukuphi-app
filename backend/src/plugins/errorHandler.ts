import {
  FastifyInstance,
  FastifyError,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { GenericError } from "../models/errors";

export const registerErrorHandler = (app: FastifyInstance) => {
  app.setErrorHandler(
    (
      error: FastifyError | GenericError,
      request: FastifyRequest,
      reply: FastifyReply
    ) => {
      const { method, url, headers, body, params, query } = request;

      const statusCode = error instanceof GenericError ? error.code : 500;
      const errorName =
        error instanceof GenericError ? error.name : "InternalServerError";

      app.log.error({
        message: error.message,
        name: errorName,
        stack: error.stack,
        request: {
          method,
          url,
          headers,
          body,
          params,
          query,
        },
        response: {
          statusCode,
        },
      });

      reply.status(statusCode).send({
        message: error.message,
      });
    }
  );
};
