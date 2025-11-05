import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/commonResponse";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error("Error caught:", err);

  // Default values
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: Array<{ field?: string; message: string }> | undefined = undefined;

  if (err instanceof Error) {
    message = err.message;
  }

  // If a custom error object is thrown, capture its fields
  if (typeof err === "object" && err && "statusCode" in err) {
    statusCode = (err as { statusCode?: number }).statusCode ?? 500;
  }

  if (typeof err === "object" && err && "errors" in err) {
    errors = (err as { errors?: Array<{ field?: string; message: string }> }).errors;
  }

  const response = errorResponse(message, statusCode, errors);

  res.status(statusCode).json(response);
}
