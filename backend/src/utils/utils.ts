import bcrypt from "bcrypt";
import * as z from "zod";

export async function hashPassword(password: string) {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword({
  candidatePassword,
  hash,
}: {
  candidatePassword: string;
  hash: string;
}) {
  return bcrypt.compare(candidatePassword, hash);
}

export function validateWithZod(schema: z.ZodSchema<any>) {
  return (data: any) => {
    try {
      const result = schema.parse(data); // Parse the input data

      return result; // Return the valid data if successful
    } catch (error) {
      // If validation fails, throw an error with all messages
      if (error instanceof z.ZodError) {
        throw new Error(
          `Validation error: ${error.errors
            .map((err) => err.message)
            .join(", ")}`
        );
      } else {
        throw new Error("Unexpected validation error");
      }
    }
  };
}
