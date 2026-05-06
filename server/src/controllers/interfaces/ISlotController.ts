import { Request, Response, NextFunction } from "express";

export interface ISlotController {
  createSlotRules(req: Request, res: Response, next: NextFunction): void;
  getSlotRule(req: Request, res: Response, next: NextFunction): void;
  getTutorRuleForClient(req: Request, res: Response, next: NextFunction): void;
}
