"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerErrorHandler = void 0;
const errors_1 = require("../models/errors");
const registerErrorHandler = (app) => {
    app.setErrorHandler((error, request, reply) => {
        const { method, url, headers, body, params, query } = request;
        const statusCode = error instanceof errors_1.GenericError ? error.code : 500;
        const errorName = error instanceof errors_1.GenericError ? error.name : "InternalServerError";
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
    });
};
exports.registerErrorHandler = registerErrorHandler;
