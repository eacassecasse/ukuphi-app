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
exports.schemas = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const z = __importStar(require("zod"));
const dateSchema = z
    .string({
    required_error: "Date is required",
})
    .refine((value) => (0, dayjs_1.default)(value, "YYYY-MM-DD HH:mm:ss", true).isValid(), {
    message: "Date must be in the format YYYY-MM-DD HH:mm:ss and valid",
});
const createPostSchema = z.object({
    title: z.string({
        required_error: "Title is required",
    }),
    content: z.string({
        required_error: "Content is required",
    }),
    featured_image: z
        .string({
        required_error: "Featured Image is required",
        invalid_type_error: "Feature Image must be a valid URL",
    })
        .url(),
});
const updatePostCore = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    featured_image: z
        .string({
        invalid_type_error: "Feature Image must be a valid URL",
    })
        .url()
        .optional(),
});
const updatePostSchema = updatePostCore.extend({
    id: z.string({
        required_error: "ID is required",
        invalid_type_error: "ID must be a UUID String"
    }).uuid()
});
const createPostResponseSchema = createPostSchema.extend({
    id: z.string(),
    published_at: dateSchema,
});
exports.schemas = {
    createPostSchema,
    createPostResponseSchema,
    updatePostCore
};
