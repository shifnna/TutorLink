//ensures reliable, safe JSON error responses instead of HTML
import { Request, Response, NextFunction } from "express";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const status = 500;
  const message = err instanceof Error ? err.message : "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
  });
}

