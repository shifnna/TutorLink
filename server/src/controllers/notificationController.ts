import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types.js";
import { INotificationService } from "../services/interfaces/INotificationService.js";
import { INotificationController } from "./interfaces/INotificationController.js";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.INotificationService)
    private readonly _notificationService: INotificationService
  ) {}

  getUserNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const notifications = await this._notificationService.getUserNotifications(req.params.userId);
      res.json({ success: true, data: notifications });
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      res.status(500).json({ success: false, message: "Failed to fetch notifications" });
    }
  };

  markOneSeen = async (req: Request, res: Response): Promise<void> => {
    try {
      const updated = await this._notificationService.markOneSeen(req.params.notificationId);
      if (!updated) {
        res.status(404).json({ success: false, message: "Notification not found" });
        return;
      }
      res.json({ success: true, data: updated });
    } catch (err) {
      console.error("Failed to mark notification as seen:", err);
      res.status(500).json({ success: false, message: "Failed to update notification" });
    }
  };

  markAllSeen = async (req: Request, res: Response): Promise<void> => {
    try {
      const modifiedCount = await this._notificationService.markAllSeen(req.params.userId);
      res.json({ success: true, modifiedCount });
    } catch (err) {
      console.error("Failed to mark notifications as seen:", err);
      res.status(500).json({ success: false, message: "Failed to update notifications" });
    }
  };
}