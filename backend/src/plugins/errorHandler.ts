import { FastifyError, FastifyInstance } from "fastify";
import {GenericError} from '../models/errors';

export function registerErrorHandler(app: FastifyInstance) {
    app.setErrorHandler((error: FastifyError | GenericError, request, reply) => {
        if (error instanceof GenericError) {
            return reply.status(error.code).send({
                message: error.message
            })
        }

        console.log("Unhandled error:", error);
        return reply.status(500).send({
            message: 'Internal Server Error'
        })
    })
}