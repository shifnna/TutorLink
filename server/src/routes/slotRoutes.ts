import { Router } from "express";
import container from "../container/inversify.config";
import { protect, tutorOnly } from "../middlewares/authMiddleware";
import { ISlotController } from "../controllers/interfaces/ISlotController";
import { TYPES } from "../types/types";

const router = Router();
const slotController = container.get<ISlotController>(TYPES.ISlotController);

// Tutor routes
router.post("/tutor/create-slot-rule", protect, tutorOnly, slotController.createSlotRules);
router.get("/tutor/rule", protect, tutorOnly, slotController.getSlotRule);


// Client routes
router.get("/client/rule/:tutorId",protect ,slotController.getTutorRuleForClient);

export default router;
