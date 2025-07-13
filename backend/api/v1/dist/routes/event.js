"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRoutes = eventRoutes;
const EventController_1 = require("../controllers/EventController");
const authenticate_1 = require("../plugins/authenticate");
const TicketController_1 = require("../controllers/TicketController");
async function eventRoutes(fastify) {
    fastify.post("/", {
        preHandler: [fastify.authenticate],
    }, EventController_1.EventController.registerHandler);
    fastify.get("/", {
        preHandler: [
            async (request, reply) => {
                const authHeader = request.headers.authorization;
                if (authHeader) {
                    const token = authHeader.split(" ")[1];
                    try {
                        const decoded = request.jwt.verify(token);
                        const refreshToken = await (0, authenticate_1.generateRefreshToken)(request, decoded);
                        reply.setCookie("refresh_token", refreshToken, {
                            httpOnly: true,
                            secure: true,
                            sameSite: "strict",
                        });
                        request.user = decoded;
                    }
                    catch (error) {
                        return reply.status(401).send({
                            message: "Unauthorized",
                        });
                    }
                }
            },
        ],
    }, EventController_1.EventController.listHandler);
    fastify.get("/:id", EventController_1.EventController.getHandler);
    fastify.put("/:id", {
        preHandler: [fastify.authenticate],
    }, EventController_1.EventController.updateHandler);
    fastify.delete("/:id", {
        preHandler: [fastify.authenticate],
    }, EventController_1.EventController.deleteHandler);
    //TICKETS
    fastify.post("/:id/tickets", {
        preHandler: [fastify.authenticate],
    }, TicketController_1.TicketController.registerHandler);
    fastify.get("/:id/tickets", TicketController_1.TicketController.listHandler);
    fastify.get("/:id/tickets/:ticketId", TicketController_1.TicketController.getHandler);
    fastify.put("/:id/tickets/:ticketId", {
        preHandler: [fastify.authenticate],
    }, TicketController_1.TicketController.updateHandler);
    fastify.delete("/:id/tickets/:ticketId", {
        preHandler: [fastify.authenticate],
    }, TicketController_1.TicketController.deleteHandler);
    //COMMENTS
    fastify.post("/:id/comments", {
        preHandler: [fastify.authenticate],
    }, EventController_1.EventController.commentHandler);
    fastify.get("/:id/comments", EventController_1.EventController.listCommentsHandler);
}
