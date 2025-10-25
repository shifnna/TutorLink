import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";
import { STATUS_CODES } from "../utils/constants";

export const validate = (schema: ZodObject<ZodRawShape>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errors = result.error.issues.map(issue => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
