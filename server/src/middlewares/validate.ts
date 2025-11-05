import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";
import { STATUS_CODES } from "../utils/constants";

export const validate = (schema: ZodObject<ZodRawShape>) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) req.body = {};
    
    //// Convert single string fields to arrays if necessary
    if (req.body.languages && typeof req.body.languages === "string") {
  req.body.languages = req.body.languages.split(",").map((s: string) => s.trim());
}
if (req.body.skills && typeof req.body.skills === "string") {
  req.body.skills = req.body.skills.split(",").map((s: string) => s.trim());
}
if (req.body.certificates && typeof req.body.certificates === "string") {
  req.body.certificates = req.body.certificates.split(",").map((s: string) => s.trim());
}


    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      console.error("Zod Validation Errors:", errors); 
      
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
