import * as z from "zod";

export function validateWithZod(schema: z.ZodSchema<any>) {
  return (data: any) => {
    try {
      const result = schema.parse(data); 

      return result; 
    } catch (error) {
      
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