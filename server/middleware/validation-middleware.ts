
import { Request, Response, NextFunction } from "express";
import { ZodSchema, z } from "zod";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        });
      }
      return res.status(400).json({ message: "Invalid request data" });
    }
  };
}

export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid parameters",
          errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        });
      }
      return res.status(400).json({ message: "Invalid parameters" });
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid query parameters",
          errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        });
      }
      return res.status(400).json({ message: "Invalid query parameters" });
    }
  };
}

// Common validation schemas
export const idParamSchema = z.object({
  id: z.string().transform(val => parseInt(val, 10)).refine(val => !isNaN(val), {
    message: "ID must be a valid number"
  })
});

export const userIdQuerySchema = z.object({
  userId: z.string().transform(val => parseInt(val, 10)).refine(val => !isNaN(val), {
    message: "User ID must be a valid number"
  })
});
