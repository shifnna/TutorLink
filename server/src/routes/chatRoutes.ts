import { Router } from "express";
import container from "../container/inversify.config.js";
import { IChatController } from "../controllers/interfaces/IChatController.js";
import { TYPES } from "../types/types.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();
const controller = container.get<IChatController>(TYPES.IChatController);

router.get("/support-contact", protect, controller.getSupportContact);
router.get("/conversations", protect, controller.getConversations);
router.post("/conversations", protect, controller.getOrCreateConversation);
router.get("/conversations/:conversationId/messages", protect, controller.getMessages);
router.post("/messages", protect, controller.sendMessage);

export default router;