"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const auth_schema_1 = require("../inputs/auth.schema");
const AuthController_1 = require("../controllers/AuthController");
const validation_zod_1 = require("../utils/validation.zod");
const UserController_1 = require("../controllers/UserController");
async function authRoutes(fastify) {
    fastify.post("/register", UserController_1.UserController.registerHandler);
    fastify.get("/profile", {
        preHandler: [fastify.authenticate],
    }, UserController_1.UserController.getHandler);
    fastify.put("/profile", {
        preHandler: [fastify.authenticate],
    }, UserController_1.UserController.updateHandler);
    fastify.post("/login", {
        schema: {
            body: auth_schema_1.schemas.jsonLoginSchema,
            response: {
                201: auth_schema_1.schemas.jsonLoginResponseSchema,
            },
        },
        preHandler: async (req, res) => {
            try {
                req.body = (0, validation_zod_1.validateWithZod)(auth_schema_1.schemas.loginSchema)(req.body);
            }
            catch (error) {
                res.status(400).send({ error: error.message });
            }
        },
    }, AuthController_1.AuthController.loginHandler);
    fastify.get("/refresh", {
        preHandler: [fastify.authenticate],
    }, AuthController_1.AuthController.refreshTokenHandler);
    fastify.post("/verify-otp", UserController_1.UserController.verifyOTPHandler);
    fastify.delete("/logout", {
        preHandler: [fastify.authenticate],
    }, AuthController_1.AuthController.logoutHandler);
}
