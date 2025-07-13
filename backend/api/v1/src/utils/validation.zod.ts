import * as z from "zod";
import BusinessError, { InternalServerError } from "../lib/errors/http/errors";

export function validateWithZod(schema: z.ZodSchema<any>) {
  return (data: any) => {
    try {
      const result = schema.parse(data); 

      return result; 
    } catch (error) {
      
      if (error instanceof z.ZodError) {
        throw new BusinessError(
          `${error.errors
            .map((err) => err.message)
            .join(", ")}`
        );
      } else {
        throw new InternalServerError();
      }
    }
  };
}