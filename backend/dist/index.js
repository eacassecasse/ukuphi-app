"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastify = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const fastify_cookie_1 = __importDefault(require("fastify-cookie"));
const fastify_rate_limiter_1 = __importDefault(require("fastify-rate-limiter"));
const dotenv_1 = __importDefault(require("dotenv"));
const authenticate_1 = require("./plugins/authenticate");
const routes_1 = require("./routes");
const errorHandler_1 = require("./plugins/errorHandler");
dotenv_1.default.config({
    path: "../.env",
});
exports.fastify = (0, fastify_1.default)({
    logger: true,
});
(0, errorHandler_1.registerErrorHandler)(exports.fastify);
exports.fastify.register(Promise.resolve().then(() => __importStar(require("@fastify/compress"))));
exports.fastify.register(cors_1.default, { origin: true });
exports.fastify.register(helmet_1.default, { contentSecurityPolicy: false });
exports.fastify.register(jwt_1.default, {
    secret: process.env.JWT_ACCESS_TOKEN_SECRET || "ukuphi-app-jwt",
    sign: {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    },
});
exports.fastify.decorate("authenticate", authenticate_1.authenticate);
exports.fastify.addHook("preHandler", (req, res, next) => {
    req.jwt = exports.fastify.jwt;
    return next();
});
exports.fastify.register(fastify_cookie_1.default, {
    secret: process.env.COOKIE_SECRET || "ukuphi-app-cookie",
});
exports.fastify.register(fastify_rate_limiter_1.default, {
    max: 100,
    timeWindow: 60,
    keyGenerator: (req) => req.ip,
});
//Routes
exports.fastify.get("/hello", async (req, res) => {
    return { message: "Hello world!", proc: process.env };
});
exports.fastify.register(routes_1.routes, { prefix: "/api/v1" });
async function bootstrap() {
    try {
        await exports.fastify.listen({
            port: parseInt(process.env.PORT || "5000"),
            host: "0.0.0.0",
        });
        console.log("Server running on port 5000");
    }
    catch (error) {
        exports.fastify.log.error(error);
        process.exit(1);
    }
}
bootstrap();
