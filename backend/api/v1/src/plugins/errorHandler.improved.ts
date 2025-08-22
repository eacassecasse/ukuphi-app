import {
  FastifyInstance,
  FastifyError,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { GenericError } from "@lib/errors/http/errors";
import { ZodError } from "zod/v4";

interface ErrorContext {
  requestId: string;
  userId?: string;
  ip: string;
  userAgent?: string;
  timestamp: string;
}

interface SecurityHeaders {
  "X-Request-ID": string;
  "X-Content-Type-Options": string;
  "X-Frame-Options": string;
  "X-XSS-Protection": string;
}

export const registerErrorHandler = (app: FastifyInstance) => {
  app.setErrorHandler(
    (
      error: FastifyError | GenericError | ZodError,
      request: FastifyRequest,
      reply: FastifyReply
    ) => {
      // Generate unique request ID if not present
      const requestId = request.headers["x-request-id"] as string || 
                       `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const context: ErrorContext = {
        requestId,
        userId: request.user?.id,
        ip: request.ip,
        userAgent: request.headers["user-agent"],
        timestamp: new Date().toISOString(),
      };

      // Determine error type and status code
      let statusCode = 500;
      let errorName = "InternalServerError";
      let errorMessage = "An unexpected error occurred";
      let details: any = undefined;

      if (error instanceof GenericError) {
        statusCode = error.statusCode;
        errorName = error.name;
        errorMessage = error.message;
      } else if (error instanceof ZodError) {
        statusCode = 422;
        errorName = "ValidationError";
        errorMessage = "Validation failed";
        details = {
          validationErrors: error.issues.map(err => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        };
      } else if (error.statusCode) {
        statusCode = error.statusCode;
        errorName = error.name || "FastifyError";
        errorMessage = error.message;
      } else if (error.code) {
        // Handle specific error codes
        switch (error.code) {
          case "FST_JWT_BAD_REQUEST":
          case "FST_JWT_MALFORMED_TOKEN":
            statusCode = 401;
            errorName = "InvalidToken";
            errorMessage = "Invalid authentication token";
            break;
          case "FST_JWT_EXPIRED":
            statusCode = 401;
            errorName = "TokenExpired";
            errorMessage = "Authentication token has expired";
            break;
          case "ENOTFOUND":
          case "ECONNREFUSED":
            statusCode = 503;
            errorName = "ServiceUnavailable";
            errorMessage = "External service temporarily unavailable";
            break;
          default:
            errorMessage = error.message;
        }
      }

      // Security: Don't expose sensitive information in production
      const isProduction = process.env.NODE_ENV === "production";
      const sanitizedErrorMessage = isProduction && statusCode >= 500 
        ? "Internal server error" 
        : errorMessage;

      // Log error with full context
      const logLevel = statusCode >= 500 ? "error" : "warn";
      app.log[logLevel]({
        error: {
          name: errorName,
          message: error.message,
          stack: error.stack,
          code: "code" in error ? (error as any).code : undefined,
        },
        request: {
          id: requestId,
          method: request.method,
          url: request.url,
          headers: sanitizeHeaders(request.headers),
          body: sanitizeBody(request.body),
          params: request.params,
          query: request.query,
        },
        response: {
          statusCode,
        },
        context,
      });

      // Set security headers
      const securityHeaders: SecurityHeaders = {
        "X-Request-ID": requestId,
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
      };

      Object.entries(securityHeaders).forEach(([header, value]) => {
        reply.header(header, value);
      });

      // Rate limiting for error responses (prevent abuse)
      if (statusCode === 401 || statusCode === 403) {
        reply.header("Retry-After", "60");
      }

      // Build error response
      const errorResponse: any = {
        error: {
          code: errorName,
          message: sanitizedErrorMessage,
          requestId,
        },
        success: false,
        timestamp: context.timestamp,
      };

      // Add details for client errors (400-499) in non-production
      if (statusCode >= 400 && statusCode < 500 && (!isProduction || details)) {
        if (details) {
          errorResponse.error.details = details;
        }
        
        // Add helpful hints for common errors
        switch (statusCode) {
          case 401:
            errorResponse.error.hint = "Please check your authentication credentials";
            break;
          case 403:
            errorResponse.error.hint = "You don't have permission to access this resource";
            break;
          case 404:
            errorResponse.error.hint = "The requested resource was not found";
            break;
          case 422:
            errorResponse.error.hint = "Please check the format of your request data";
            break;
          case 429:
            errorResponse.error.hint = "Too many requests. Please try again later";
            break;
        }
      }

      reply.status(statusCode).send(errorResponse);
    }
  );

  // Handle 404 for routes that don't exist
  app.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    reply.status(404).send({
      error: {
        code: "RouteNotFound",
        message: "The requested endpoint does not exist",
        requestId,
      },
      success: false,
      timestamp: new Date().toISOString(),
    });
  });
};

function sanitizeHeaders(headers: any): any {
  const sensitiveHeaders = ["authorization", "cookie", "x-api-key"];
  const sanitized = { ...headers };
  
  sensitiveHeaders.forEach(header => {
    if (sanitized[header]) {
      sanitized[header] = "[REDACTED]";
    }
  });
  
  return sanitized;
}

function sanitizeBody(body: any): any {
  if (!body || typeof body !== "object") {
    return body;
  }

  const sensitiveFields = ["password", "token", "secret", "key", "creditCard"];
  const sanitized = { ...body };
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = "[REDACTED]";
    }
  });
  
  return sanitized;
}

// Export for testing
export { sanitizeHeaders, sanitizeBody };
