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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = require("../lib/prisma");
const redis_1 = require("../lib/redis");
const errors_1 = __importStar(require("../models/errors"));
const bcrypt_1 = require("../utils/bcrypt");
const otp_1 = require("../utils/otp");
const utils_1 = require("../utils/utils");
class UserService {
    static async findUserByEmail(email) {
        const user = await prisma_1.db.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                password: true,
            },
        });
        if (!user) {
            throw new errors_1.NotFoundError("User not found");
        }
        return user;
    }
    static async findOne(id) {
        const user = await prisma_1.db.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                verified: true,
            },
        });
        if (!user) {
            throw new errors_1.NotFoundError("User not found");
        }
        return user;
    }
    static async createUser(input) {
        const { password, role, ...rest } = input;
        const hashedPassword = await (0, bcrypt_1.hashPassword)(password);
        const dbUser = await prisma_1.db.user.findUnique({
            where: {
                email: input.email,
            },
        });
        if (dbUser) {
            throw new errors_1.default("User already exists");
        }
        const user = await prisma_1.db.user.create({
            data: { ...rest, role: role, password: hashedPassword },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                verified: true,
            },
        });
        await prisma_1.db.notification.create({
            data: {
                message: "Welcome to Ukuphi App! We're glad to have you.",
                type: "INFO",
                status: "UNREAD",
                userId: user.id,
                sentAt: new Date(),
            },
        });
        return user;
    }
    static async updateUser(input) {
        const { password, role, ...rest } = input;
        const dbUser = await prisma_1.db.user.findUnique({
            where: { id: input.id },
        });
        if (!dbUser) {
            throw new errors_1.NotFoundError("User not found");
        }
        const updatedData = {
            ...(input.name ? { name: input.name } : {}),
            ...(input.email ? { email: input.email } : {}),
            ...(input.phone ? { phone: input.phone } : {}),
            ...(input.password
                ? { password: await (0, bcrypt_1.hashPassword)(input.password) }
                : {}),
            ...(input.role ? { role: input.role } : {}),
        };
        const user = await prisma_1.db.user.update({
            where: { id: dbUser.id },
            data: updatedData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                verified: true,
            },
        });
        await prisma_1.db.notification.create({
            data: {
                message: "Your profile has been successfully update.",
                type: "INFO",
                status: "UNREAD",
                userId: user.id,
                sentAt: new Date(),
            },
        });
        return user;
    }
    static async getUser(id) {
        const user = await prisma_1.db.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
            },
        });
        if (!user) {
            throw new errors_1.NotFoundError("User not found");
        }
        return user;
    }
    static async deleteUser(id) {
        const user = await prisma_1.db.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new errors_1.NotFoundError("User not found");
        }
        await prisma_1.db.user.delete({
            where: { id: user.id },
        });
    }
    static async generateAndSendOTP(user) {
        const otp = (0, utils_1.generate6DigitsNumber)().toString();
        const ttl = 300;
        await redis_1.redis.connect();
        await redis_1.redis.set(`otp:${user.id}`, otp, ttl);
        const target = user.email || user.phone;
        const method = user.email ? "email" : "phone";
        await (0, otp_1.sendOTP)(target, otp, method);
    }
    static async verifyOTP(userId, otp) {
        const otpKey = `otp:${userId}`;
        const storedOtp = await redis_1.redis.get(otpKey);
        if (!storedOtp || storedOtp !== otp) {
            throw new errors_1.default("Invalid OTP");
        }
        const user = await prisma_1.db.user.update({
            where: { id: userId },
            data: { verified: true },
        });
        await redis_1.redis.delete(otpKey); // Remove the OTP after successful verification
        return user;
    }
}
exports.UserService = UserService;
