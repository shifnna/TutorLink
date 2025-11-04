import { Router } from "express";
import container from "../container/inversify.config";
import { protect, tutorOnly } from "../middlewares/authMiddleware";
import { ISlotController } from "../controllers/interfaces/ISlotController";
import { TYPES } from "../types/types";

const router = Router();
const slotController = container.get<ISlotController>(TYPES.ISlotController);

// Tutor routes
router.post("/tutor/create-slot-rule", protect, tutorOnly, slotController.createSlotRules);
router.get("/tutor", protect, tutorOnly, slotController.getSlots);
router.delete("/tutor/:slotId", protect, tutorOnly, slotController.deleteSlot);
router.get("/tutor/rule", protect, tutorOnly, slotController.getSlotRule);


// Client routes
router.get("/client/:tutorId", slotController.getAvailableSlots);
router.post("/client/book/:slotId/:userId", slotController.bookSession);
router.get("/client/sessions/:userId", slotController.getAllSessions);
router.patch("/client/sessions/cancel/:id", slotController.cancelSession);

export default router;
