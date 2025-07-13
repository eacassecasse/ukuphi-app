export abstract class GenericError extends Error {
  abstract readonly statusCode: number;
  abstract serialize(): { message: string; details?: unknown };
}