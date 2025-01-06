"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
const validation_zod_1 = require("../utils/validation.zod");
const user_schema_1 = require("../inputs/user.schema");
const NotificationService_1 = require("../services/NotificationService");
const nodemailer_1 = require("../lib/nodemailer");
class UserController {
    static async registerHandler(request, reply) {
        const body = (0, validation_zod_1.validateWithZod)(user_schema_1.schemas.createUserSchema)(request.body);
        const user = await UserService_1.UserService.createUser(body);
        (0, validation_zod_1.validateWithZod)(user_schema_1.schemas.createUserResponseSchema)(user);
        await UserService_1.UserService.generateAndSendOTP({
            id: user.id,
            email: user.email,
            phone: user.phone || "",
        });
        return reply.status(201).send(user);
    }
    static async getHandler(request, reply) {
        const user = await UserService_1.UserService.findOne(request.user.id);
        const response = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            role: user.role,
        };
        return reply.status(200).send(response);
    }
    static async updateHandler(request, reply) {
        const body = (0, validation_zod_1.validateWithZod)(user_schema_1.schemas.updateUserCore)(request.body);
        const input = {
            id: request.user.id,
            ...body,
        };
        const user = await UserService_1.UserService.updateUser(input);
        (0, validation_zod_1.validateWithZod)(user_schema_1.schemas.createUserResponseSchema)(user);
        return reply.status(200).send(user);
    }
    static async verifyOTPHandler(request, reply) {
        const { userId, otp } = request.body;
        const user = await UserService_1.UserService.verifyOTP(userId, otp);
        await NotificationService_1.NotificationService.create(user.id, {
            message: "Your profile was successfully updated",
            type: "INFO",
            status: "UNREAD",
        });
        await (0, nodemailer_1.sendMail)(user.email, "Welcome Aboard! Your Account is Successfully Verified", "verification", {
            userName: user.name,
        });
        return reply.status(200).send({ message: "OTP verified successfully" });
    }
}
exports.UserController = UserController;
