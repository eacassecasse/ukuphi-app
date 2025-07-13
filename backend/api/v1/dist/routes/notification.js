"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = notificationRoutes;
const NotificationController_1 = require("../controllers/NotificationController");
async function notificationRoutes(fastify) {
    fastify.get("/", {
        preHandler: [fastify.authenticate],
    }, NotificationController_1.NotificationController.listHandler);
    fastify.put("/:id", {
        preHandler: [fastify.authenticate],
    }, NotificationController_1.NotificationController.updateHandler);
}
