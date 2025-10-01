import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";
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
    } catch (err: any) {
      //// Map Zod issues to only the message
      const errors = Array.isArray(err?.issues) ? err.issues.map((e: any) => e.message): [err.message || "Validation failed"];
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: errors });
    }
  };
