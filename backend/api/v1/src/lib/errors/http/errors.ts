export class GenericError extends Error {
  readonly statusCode: number = 500;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InternalServerError extends GenericError {
  constructor() {
    super("Internal Server Error");
  }
}

export class NotFoundError extends GenericError {
  readonly statusCode = 404;
  constructor(resource: string) {
    super(`${resource} not found`);
  }
}

export default class BusinessError extends GenericError {
  readonly statusCode = 400;
  constructor(message: string) {
    super(message);
  }
}

export class AuthError extends GenericError {
  readonly statusCode = 401;
  constructor(message?: string) {
    super(message ?? "Not Authorized");
    this.name = "Unauthorized";
  }
}

export class ForbiddenError extends GenericError {
  readonly statusCode = 403;
  constructor(message?: string) {
    super(message ?? "Access Denied");
    this.name = "Forbidden";
  }
}
