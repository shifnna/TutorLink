import { inject, injectable } from "inversify";
import { TYPES } from "../types/types.js";
import { INotificationRepository } from "../repositories/interfaces/INotificationRepository.js";
import {
  INotificationService,
  CreateNotificationInput,
} from "./interfaces/INotificationService.js";
import { INotification } from "../models/notifications.js";
import { getIO } from "../socket.js";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.INotificationRepository)
    private readonly _notificationRepo: INotificationRepository
  ) {}

  async createAndSendNotification(data: CreateNotificationInput): Promise<INotification> {
    const notification = await this._notificationRepo.createNotification(data);

    getIO().to(data.userId.toString()).emit("new-notification", notification);

    return notification;
  }

  async getUserNotifications(userId: string): Promise<INotification[]> {
    return this._notificationRepo.findByUserId(userId);
  }

  async markOneSeen(notificationId: string): Promise<INotification | null> {
    return this._notificationRepo.markOneSeen(notificationId);
  }

  async markAllSeen(userId: string): Promise<number> {
    return this._notificationRepo.markAllSeen(userId);
  }
}