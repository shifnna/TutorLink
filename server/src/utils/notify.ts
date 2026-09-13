import container from "../container/inversify.config.js";
import { TYPES } from "../types/types.js";
import {
  INotificationService,
  CreateNotificationInput,
} from "../services/interfaces/INotificationService.js";

export async function createAndSendNotification(data: CreateNotificationInput) {
  const notificationService = container.get<INotificationService>(TYPES.INotificationService);
  return notificationService.createAndSendNotification(data);
}