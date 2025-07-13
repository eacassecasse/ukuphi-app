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
const zod_to_json_schema_1 = require("zod-to-json-schema");
const passwordSchema = z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must include an uppercase letter" })
    .regex(/[a-z]/, { message: "Password must include a lowercase letter" })
    .regex(/[0-9]/, { message: "Password must include a number" });
const loginSchema = z.object({
    email: z
        .string({
        required_error: "Email is required",
        invalid_type_error: "Email is not valid",
    })
        .email(),
    password: passwordSchema
});
const loginResponseSchema = z.object({
    accessToken: z.string(),
});
const jsonLoginSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(loginSchema);
const jsonLoginResponseSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(loginResponseSchema);
exports.schemas = {
    loginSchema,
    loginResponseSchema,
    jsonLoginSchema,
    jsonLoginResponseSchema,
};
