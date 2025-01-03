export class GenericError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
  }
}

export class ServerError extends GenericError {
  constructor(message: string) {
    super(message, 500);
  }
}

export class NotFoundError extends GenericError {
  constructor(message: string) {
    super(message, 404);
  }
}

export default class BusinessError extends GenericError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthError extends GenericError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenError extends GenericError {
  constructor(message: string) {
    super(message, 403);
  }
}
