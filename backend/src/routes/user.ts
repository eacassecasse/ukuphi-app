import { FastifyInstance } from "fastify"
import { UserController } from "../controllers/UserController";


async function userRoutes(fastify: FastifyInstance) {

    fastify.post('/', UserController.registerHandler);
}

export default userRoutes;