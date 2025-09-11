import { Router } from "express";
import { TutorController } from "../controllers/tutorController";

const router = Router();

router.post('/apply-for-tutor',TutorController.applyForTutor)

export default router;