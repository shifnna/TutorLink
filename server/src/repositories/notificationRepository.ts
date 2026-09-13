import { injectable } from "inversify";
import { Types } from "mongoose";
import { INotification, NotificationModel } from "../models/notifications.js";
import {
  INotificationRepository,
  CreateNotificationData,
} from "./interfaces/INotificationRepository.js";
import { BaseRepository } from "./baseRepository.js";

@injectable()
export class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  constructor() {
    super(NotificationModel);
  }

  async createNotification(data: CreateNotificationData): Promise<INotification> {
    return this.create({
      userId: new Types.ObjectId(data.userId),
      title: data.title,
      message: data.message,
      link: data.link,
    } as Partial<INotification>);
  }

  async findByUserId(userId: string): Promise<INotification[]> {
    return this.findAll({ userId: new Types.ObjectId(userId) }, { createdAt: -1 });
  }

  async markOneSeen(notificationId: string): Promise<INotification | null> {
    return this.findByIdAndUpdate(notificationId, { $set: { seen: true } });
  }

  // Bulk update isn't in BaseRepository, so this.model is used directly
  async markAllSeen(userId: string): Promise<number> {
    const result = await this.model.updateMany(
      { userId: new Types.ObjectId(userId), seen: false },
      { $set: { seen: true } }
    );
    return result.modifiedCount;
  }
}