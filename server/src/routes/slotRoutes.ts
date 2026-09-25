import { Router } from "express";
import container from "../container/inversify.config.js";
import { protect, tutorOnly } from "../middlewares/authMiddleware.js";
import { ISlotController } from "../controllers/interfaces/ISlotController.js";
import { TYPES } from "../types/types.js";

const router = Router();
const slotController = container.get<ISlotController>(TYPES.ISlotController);

// Tutor routes
router.post("/tutor/create-slot-rule", protect, tutorOnly, slotController.createSlotRule);
router.get("/tutor/rules", protect, tutorOnly, slotController.getSlotRules);

// Client routes
router.get("/client/available-slots/:tutorId", protect, slotController.getAvailableSlots);
router.post("/client/book-slot", protect, slotController.bookSlot);

export default router;