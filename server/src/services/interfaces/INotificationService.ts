import { INotification } from "../../models/notifications.js";

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  link?: string;
}

export interface INotificationService {
  createAndSendNotification(data: CreateNotificationInput): Promise<INotification>;
  getUserNotifications(userId: string): Promise<INotification[]>;
  markOneSeen(notificationId: string): Promise<INotification | null>;
  markAllSeen(userId: string): Promise<number>;
}