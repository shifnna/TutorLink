import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { NotificationModel } from "../models/notifications";

const router = Router();

router.get("/:userId", protect, async (req, res) => {
  const notifications = await NotificationModel.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json({ success: true, data: notifications });
});

export default router;