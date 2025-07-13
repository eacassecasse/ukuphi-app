"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = postRoutes;
const PostController_1 = require("../controllers/PostController");
const TagController_1 = require("../controllers/TagController");
async function postRoutes(fastify) {
    fastify.post("/", {
        preHandler: [fastify.authenticate],
    }, PostController_1.PostController.createHandler);
    fastify.get("/", PostController_1.PostController.listHandler);
    fastify.get("/:id", PostController_1.PostController.getHandler);
    fastify.put("/:id", {
        preHandler: [fastify.authenticate],
    }, PostController_1.PostController.updateHandler);
    fastify.delete("/:id", {
        preHandler: [fastify.authenticate],
    }, PostController_1.PostController.deleteHandler);
    //TAGS
    fastify.post("/:id/tags", {
        preHandler: [fastify.authenticate],
    }, TagController_1.TagController.registerHandler);
    fastify.get("/:id/tags", TagController_1.TagController.listHandler);
    fastify.get("/:id/tags/:tagId", TagController_1.TagController.getHandler);
    fastify.delete("/:id/tags/:tagd", {
        preHandler: [fastify.authenticate],
    }, TagController_1.TagController.deleteHandler);
    //COMMENTS
    fastify.post("/:id/comments", {
        preHandler: [fastify.authenticate],
    }, PostController_1.PostController.commentHandler);
    fastify.get("/:id/comments", PostController_1.PostController.listCommentsHandler);
}
