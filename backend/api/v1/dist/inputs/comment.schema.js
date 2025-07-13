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
const uuidSchema = z.string().uuid({ message: "Must be a valid UUID string" });
const createCommentSchema = z.object({
    title: z.string({
        required_error: "Title is required",
    }),
    content: z.string({
        required_error: "Content is required",
    }),
});
const createEventCommentSchema = createCommentSchema.extend({
    event_id: uuidSchema
});
const updateCommentSchema = createEventCommentSchema.extend({
    id: uuidSchema
});
const createPostCommentSchema = createCommentSchema.extend({
    post_id: uuidSchema
});
const createCommentResponseCore = createCommentSchema.extend({
    id: uuidSchema,
    user: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
    }),
});
const createEventCommentResponseSchema = createCommentResponseCore.extend({
    event: z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        location: z.string(),
        date: z.date(),
    }),
});
const createPostCommentResponseSchema = createCommentResponseCore.extend({
    post: z.object({
        id: uuidSchema,
        title: z.string(),
        publishedAt: z.date(),
    }),
});
exports.schemas = {
    createCommentSchema,
    createEventCommentSchema,
    createEventCommentResponseSchema,
    createPostCommentSchema,
    createPostCommentResponseSchema,
};
