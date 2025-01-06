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
exports.schemas = void 0;
const z = __importStar(require("zod"));
const userCore = z.object({
    email: z
        .string({
        required_error: "Email is required",
        invalid_type_error: "Email is not valid",
    })
        .email(),
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    }),
    phone: z
        .string({
        required_error: "Phone number is required",
        invalid_type_error: "Phone number must be a string",
    })
        .regex(/^\+?[1-9]\d{1,14}$/, {
        message: "Phone number must be a valid international format (e.g., +1234567890)",
    }),
    role: z
        .enum(["ORGANIZER", "ATTENDEE", "ADMIN"], {
        invalid_type_error: "Role must be one of: organizer, admin, attendee",
    }).default("ATTENDEE")
        .optional(),
});
const createUserSchema = userCore.extend({
    password: z.string({
        required_error: "Password is required",
    }),
});
const updateUserCore = z.object({
    email: z
        .string({
        invalid_type_error: "Email is not valid",
    })
        .email()
        .optional(),
    name: z
        .string({
        invalid_type_error: "Name must be a string",
    })
        .optional(),
    phone: z
        .string({
        invalid_type_error: "Phone number must be a string",
    })
        .regex(/^\+?[1-9]\d{1,14}$/, {
        message: "Phone number must be a valid international format (e.g., +1234567890)",
    })
        .optional(),
    role: z
        .enum(["ORGANIZER", "ATTENDEE", "ADMIN"], {
        invalid_type_error: "Role must be one of: organizer, admin, attendee",
    }).default("ATTENDEE")
        .optional(),
    password: z.string().optional(),
});
const updateUserSchema = updateUserCore.extend({
    id: z.string({
        required_error: "ID is required",
        invalid_type_error: "ID must be a UUID String"
    }).uuid()
});
const createUserResponseSchema = userCore.extend({
    id: z.string(),
});
exports.schemas = {
    createUserSchema,
    createUserResponseSchema,
    updateUserCore,
};
