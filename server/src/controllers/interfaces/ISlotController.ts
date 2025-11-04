import { Request, Response, NextFunction } from "express";

export interface ISlotController {
  createSlotRules(req: Request, res: Response, next: NextFunction): void;
  getSlotRule(req: Request, res: Response, next: NextFunction): void;
  getSlots(req: Request, res: Response, next: NextFunction): void;
  deleteSlot(req: Request, res: Response, next: NextFunction): void;
  getAvailableSlots(req: Request, res: Response, next: NextFunction): void;
  bookSession(req: Request, res: Response, next: NextFunction): void;
  getAllSessions(req: Request, res: Response, next: NextFunction): void;
  cancelSession(req: Request, res: Response, next: NextFunction): void;
}
