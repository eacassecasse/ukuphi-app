"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const fastify_1 = __importDefault(require("fastify"));
const UserService_1 = require("../services/UserService");
const bcrypt_1 = require("../utils/bcrypt");
const authenticate_1 = require("../plugins/authenticate");
const NotificationService_1 = require("../services/NotificationService");
class AuthController {
    static async loginHandler(request, reply) {
        const body = request.body;
        const user = await UserService_1.UserService.findUserByEmail(body.email);
        if (!user) {
            return reply.status(401).send({
                message: "Invalid email address. Try again!",
            });
        }
        const isValidPassword = (0, bcrypt_1.verifyPassword)({
            candidatePassword: body.password,
            hash: user.password,
        });
        if (!isValidPassword) {
            return reply.status(401).send({
                message: "Password is incorrect",
            });
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        const token = request.jwt.sign(payload, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
        });
        const refreshToken = await (0, authenticate_1.generateRefreshToken)(request, payload);
        reply.setCookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        await NotificationService_1.NotificationService.create(user.id, {
            message: "New login detected from a new device/location",
            type: "WARNING",
            status: "UNREAD"
        });
        return { accessToken: token, refreshToken };
    }
    static async refreshTokenHandler(request, reply) {
        const refreshToken = request.cookies.refresh_token;
        if (!refreshToken) {
            return reply.status(401).send({
                message: "Refresh token missing",
            });
        }
        const decoded = await (0, fastify_1.default)().jwt.verify(refreshToken);
        const newAccessToken = request.jwt.sign(decoded, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
        });
        const newRefreshToken = await (0, authenticate_1.generateRefreshToken)(request, decoded);
        reply.setCookie("refresh_token", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        return { accessToken: newAccessToken, refreshToken };
    }
    static async logoutHandler(request, reply) {
        reply.clearCookie("access_token");
        reply.clearCookie("refresh_token");
        return reply.status(200).send({ message: "Logged out successfully" });
    }
}
exports.AuthController = AuthController;
