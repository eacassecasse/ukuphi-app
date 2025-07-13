import { AppError } from "../../../plugins/errors";

export class PaymentProcessingError extends AppError {
  readonly statusCode = 422;

  constructor(public readonly transactionId: string) {
    super("Payment processing failed");
  }

  serialize() {
    return {
      message: this.message,
      transactionId: this.transactionId,
      retryable: true,
    };
  }
}
