import { Router } from "express";
import container from "../container/inversify.config";
import { ITutorController } from "../controllers/interfaces/ITutorController";
import { TYPES } from "../types/types";
import { protect } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import { applyTutorSchema} from "../validators/tutorValidator";

const router = Router();

const controller = container.get<ITutorController>(TYPES.ITutorController);

router.post("/apply-for-tutor", protect,validate(applyTutorSchema), controller.applyForTutor)
router.get("/get-tutors", protect,controller.getAllTutors);
router.get("/get-tutor/:tutorId", protect,controller.getTutorById);
router.get("/profile", protect,controller.getTutorProfile);


export default router;