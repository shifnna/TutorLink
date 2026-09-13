import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import container from "../container/inversify.config.js";
import { INotificationController } from "../controllers/interfaces/INotificationController.js";
import { TYPES } from "../types/types.js";

const router = Router();

const notificationController = container.get<INotificationController>(TYPES.INotificationController);

router.get("/:userId", protect, notificationController.getUserNotifications);
router.patch("/:notificationId/seen", protect, notificationController.markOneSeen);
router.patch("/:userId/seen-all", protect, notificationController.markAllSeen);

export default router;