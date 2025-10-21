import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject, ZodRawShape } from "zod";
import { STATUS_CODES } from "../utils/constants";

export const validate = (schema: ZodObject<ZodRawShape>) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err: unknown) {
      //// Map Zod issues to only the message
      if (err instanceof ZodError) {
        const errors = err.issues.map(issue => issue.message);
        return res.status(STATUS_CODES.BAD_REQUEST).json({ error: errors });
      }
    }
  };
