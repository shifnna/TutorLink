import { Router } from "express";
import container from "../container/inversify.config";
import { ITutorController } from "../controllers/interfaces/ITutorController";
import { TYPES } from "../types/types";
import { protect } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import { applyTutorSchema, presignSchema } from "../validators/tutorValidator";

const router = Router();

const controller = container.get<ITutorController>(TYPES.ITutorController);
router.post("/apply-for-tutor",protect,validate(applyTutorSchema), controller.applyForTutor.bind(controller))
router.post("/upload/presign",protect,validate(presignSchema), controller.getPresignedUrl.bind(controller));
router.get("/get-tutors", protect,controller.getAllTutors.bind(controller));

export default router;