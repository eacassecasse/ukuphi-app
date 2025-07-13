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
exports.NotificationService = void 0;
const prisma_1 = require("../lib/prisma");
const errors_1 = __importStar(require("../models/errors"));
const UserService_1 = require("./UserService");
class NotificationService {
    static async create(userId, input) {
        try {
            const notification = await prisma_1.db.notification.create({
                data: {
                    ...input,
                    sentAt: new Date(),
                    userId,
                },
            });
            return notification;
        }
        catch (error) {
            throw new Error("Failed to create a notification");
        }
    }
    static async find(id) {
        const user = await UserService_1.UserService.findOne(id);
        const notifications = await prisma_1.db.notification.findMany({
            where: {
                userId: user.id,
            },
        });
        if (notifications.length === 0) {
            throw new errors_1.NotFoundError("No notifications found for this user");
        }
        return notifications;
    }
    static async update(userId, input) {
        const { id } = input;
        const dbNotification = await prisma_1.db.notification.findUnique({
            where: {
                id: id,
                userId: userId,
            },
        });
        if (!dbNotification) {
            throw new errors_1.NotFoundError("Notification not found");
        }
        if (dbNotification.status === 'READ') {
            throw new errors_1.default("This notification has been read already.");
        }
        const notification = await prisma_1.db.notification.update({
            where: {
                id: dbNotification.id,
                userId,
            },
            data: {
                status: "READ",
            },
            select: {
                id: true,
                type: true,
                message: true,
                sentAt: true,
                status: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });
        return notification;
    }
}
exports.NotificationService = NotificationService;
