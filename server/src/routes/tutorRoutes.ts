import { Router } from "express";
import container from "../container/inversify.config.js";
import { ITutorController } from "../controllers/interfaces/ITutorController.js";
import { TYPES } from "../types/types.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { applyTutorSchema} from "../validators/tutorValidator.js";

const router = Router();

const controller = container.get<ITutorController>(TYPES.ITutorController);

router.post("/apply-for-tutor", protect,validate(applyTutorSchema), controller.applyForTutor)
router.get("/get-tutors", protect,controller.getAllTutors);
router.get("/get-tutor/:tutorId", protect,controller.getTutorById);
router.get("/profile", protect,controller.getTutorProfile);


export default router;