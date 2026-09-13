import { Request, Response } from "express";

export interface INotificationController {
  getUserNotifications: (req: Request, res: Response) => Promise<void>;
  markOneSeen: (req: Request, res: Response) => Promise<void>;
  markAllSeen: (req: Request, res: Response) => Promise<void>;
}