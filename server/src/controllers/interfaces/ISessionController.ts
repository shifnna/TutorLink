import { NextFunction, Request, Response } from "express";

export interface ISessionController{
  bookSession(req: Request, res: Response, next: NextFunction): void;
  getAllSessions(req: Request, res: Response, next: NextFunction): void;
  cancelSession(req: Request, res: Response, next: NextFunction): void;
  verifyPayment(req: Request, res: Response, next: NextFunction): void;
  sentFeedback (req: Request, res: Response, next: NextFunction): void;
}