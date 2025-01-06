"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketRoutes = ticketRoutes;
const TicketController_1 = require("../controllers/TicketController");
async function ticketRoutes(fastify) {
    fastify.post("/:id/payments", {
        preHandler: [fastify.authenticate],
    }, TicketController_1.TicketController.purchaseHandler);
    fastify.get("/:id/payments", {
        preHandler: [fastify.authenticate],
    }, TicketController_1.TicketController.viewPaymentHandler);
}
