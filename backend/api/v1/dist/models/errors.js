"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.AuthError = exports.NotFoundError = exports.ServerError = exports.GenericError = void 0;
class GenericError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = this.constructor.name;
    }
}
exports.GenericError = GenericError;
class ServerError extends GenericError {
    constructor(message) {
        super(message, 500);
    }
}
exports.ServerError = ServerError;
class NotFoundError extends GenericError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class BusinessError extends GenericError {
    constructor(message) {
        super(message, 400);
    }
}
exports.default = BusinessError;
class AuthError extends GenericError {
    constructor(message) {
        super(message, 401);
    }
}
exports.AuthError = AuthError;
class ForbiddenError extends GenericError {
    constructor(message) {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
