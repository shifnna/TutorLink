import { Router } from "express";
import container from "../config/inversify";
import { ITutorController } from "../controllers/interfaces/ITutorController";
import { TYPES } from "../types/types";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

const controller = container.get<ITutorController>(TYPES.ITutorController);
router.post("/apply-for-tutor",protect, controller.applyForTutor.bind(controller))
router.post('/apply-for-tutor',protect, controller.applyForTutor.bind(controller));
router.post("/upload/presign",protect, controller.getPresignedUrl.bind(controller));
router.get("/get-tutors", protect,controller.getAllTutors.bind(controller));

export default router;