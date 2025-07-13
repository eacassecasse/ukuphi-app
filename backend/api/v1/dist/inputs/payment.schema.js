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
const paymentCore = z.object({
    amount: z.number({
        required_error: "Amount is required",
    }),
    method: z.enum(["DEBIT_CARD", "CREDIT_CARD", "MOBILE_WALLET"], {
        required_error: "Method is required",
        invalid_type_error: "Type must be one of: debit_card, credit_card, mobile_wallet"
    }),
});
const createPaymentSchema = paymentCore.extend({
    ticket_id: z
        .string({
        invalid_type_error: "The Ticket ID must be a valid UUID String",
    })
        .uuid(),
});
const updatePaymentCore = z.object({
    amount: z.number().optional(),
    method: z.string().optional(),
});
const updatePaymentSchema = updatePaymentCore.extend({
    id: z.string({
        required_error: "ID is required",
        invalid_type_error: "ID must be a UUID String"
    }).uuid()
});
const createPaymentResponseSchema = paymentCore.extend({
    id: z.string(),
    status: z.string(),
    qr_code: z.string(),
    created_at: z.date(),
    ticket: z.object({
        id: z.string(),
        type: z.string(),
        price: z.number(),
    }),
});
exports.schemas = {
    createPaymentSchema,
    createPaymentResponseSchema,
    paymentCore,
    updatePaymentCore
};
