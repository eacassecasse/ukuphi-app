import { z } from 'zod/v4';

export const UserRoleSchema = z.enum(['ATTENDEE', 'ORGANIZER', 'ADMIN']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const VerificationStatusSchema = z.enum(['PHONE_VERIFIED', 'ID_VERIFIED', 'UNVERIFIED']);
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;

export const EventStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']);
export type EventStatus = z.infer<typeof EventStatusSchema>;

export const OrderStatusSchema = z.enum([
  'PENDING_PAYMENT', 
  'PAID', 
  'PAYMENT_FAILED', 
  'PARTIALLY_REFUNDED', 
  'FULLY_REFUNDED', 
  'CANCELLED'
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const PaymentMethodSchema = z.enum([
  'MPESA', 
  'CREDIT_CARD', 
  'DEBIT_CARD', 
  'MOBILE_MONEY', 
  'BANK_TRANSFER', 
  'CASH'
]);
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const TicketStatusSchema = z.enum(['ACTIVE', 'CHECKED_IN', 'TRANSFERRED', 'REFUNDED']);
export type TicketStatus = z.infer<typeof TicketStatusSchema>;

export const NotificationTypeSchema = z.enum(['SYSTEM', 'EVENT', 'PAYMENT']);
export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export const RefundReasonSchema = z.enum(['CANCELLED', 'DISPUTE', 'CUSTOMER_REQUEST']);
export type RefundReason = z.infer<typeof RefundReasonSchema>;

export const RefundStatusSchema = z.enum(['PENDING', 'COMPLETED', 'FAILED']);
export type RefundStatus = z.infer<typeof RefundStatusSchema>;

export const PostStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
export type PostStatus = z.infer<typeof PostStatusSchema>;