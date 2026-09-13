import { INotification } from "../../models/notifications.js";

export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
  link?: string;
}

export interface INotificationRepository {
  createNotification(data: CreateNotificationData): Promise<INotification>;
  findByUserId(userId: string): Promise<INotification[]>;
  markOneSeen(notificationId: string): Promise<INotification | null>;
  markAllSeen(userId: string): Promise<number>;
}