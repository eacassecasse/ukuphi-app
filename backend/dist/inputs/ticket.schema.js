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
const ticketCore = z.object({
    type: z.string({
        required_error: "Type is required",
    }),
    price: z
        .number({
        required_error: "Price is required",
    })
        .refine((value) => Number.isInteger(value * 100), {
        message: "Price must have at most 2 decimal places",
    }),
    existingQuantity: z.number({
        required_error: "Existing Quantity is required",
    }),
});
const createTicketSchema = ticketCore.extend({
    event_id: z
        .string({
        invalid_type_error: "The Ticket ID must be a valid UUID String",
    })
        .uuid(),
});
const updateTicketCore = z.object({
    type: z.string().optional(),
    price: z
        .number()
        .refine((value) => Number.isInteger(value * 100), {
        message: "Price must have at most 2 decimal places",
    }).optional(),
    existentQuantity: z.number().optional(),
});
const updateTicketSchema = updateTicketCore.extend({
    id: z.string({
        required_error: "ID is required",
        invalid_type_error: "ID must be a UUID String"
    }).uuid(),
    event_id: z.string({
        required_error: "Event ID is required",
        invalid_type_error: "Event ID must be a UUID String"
    }).uuid()
});
const createTicketResponseSchema = ticketCore.extend({
    id: z.string(),
    event: z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        location: z.string(),
        date: z.date(),
    }),
});
exports.schemas = {
    ticketCore,
    createTicketSchema,
    createTicketResponseSchema,
    updateTicketCore,
};
