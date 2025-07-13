"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = routes;
const auth_1 = require("./auth");
const event_1 = require("./event");
const ticket_1 = require("./ticket");
const notification_1 = require("./notification");
const post_1 = require("./post");
async function routes(fastify, options) {
    fastify.register(auth_1.authRoutes, { prefix: "/auth" });
    fastify.register(event_1.eventRoutes, { prefix: "/events" });
    fastify.register(ticket_1.ticketRoutes, { prefix: "/tickets" });
    fastify.register(post_1.postRoutes, { prefix: "/posts" });
    fastify.register(notification_1.notificationRoutes, { prefix: "/notifications" });
}
