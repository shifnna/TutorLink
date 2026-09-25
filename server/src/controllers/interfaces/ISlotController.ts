import { NextFunction, Request, Response } from "express";

export interface ISlotController {
  createSlotRule(req: Request, res: Response, next: NextFunction): void;
  getSlotRules(req: Request, res: Response, next: NextFunction): void;
  getAvailableSlots(req: Request, res: Response, next: NextFunction): void;
  bookSlot(req: Request, res: Response, next: NextFunction): void;
}