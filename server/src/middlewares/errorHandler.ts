import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/commonResponse.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error("Error caught:", err);

  const statusCode = typeof err === "object" && err && "statusCode" in err
    ? (err as { statusCode?: number }).statusCode ?? 500
    : 500;

  const errors = typeof err === "object" && err && "errors" in err
    ? (err as { errors?: Array<{ field?: string; message: string }> }).errors
    : undefined;

  res.status(statusCode).json(
    errorResponse(
      err instanceof Error ? err.message : "Internal Server Error",
      statusCode,
      errors
    )
  );
}