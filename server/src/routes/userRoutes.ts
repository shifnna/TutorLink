import { Router } from "express";
import container from "../config/inversify";
import { ITutorController } from "../controllers/interfaces/ITutorController";
import { TYPES } from "../types/types";

const router = Router();
const controller = container.get<ITutorController>(TYPES.ITutorController);

router.post('/apply-for-tutor',controller.applyForTutor.bind(controller));

export default router;