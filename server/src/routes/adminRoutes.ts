import { Router } from "express";
import container from "../container/inversify.config";
import { IAdminController } from "../controllers/interfaces/IAdminController";
import { TYPES } from "../types/types";
import { adminOnly, protect } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import { approveTutorSchema, rejectTutorSchema, toggleUserSchema } from "../validators/adminValidator";

const router = Router();
const controller = container.get<IAdminController>(TYPES.IAdminController)

router.get("/clients",protect,adminOnly, controller.getAllClients);
router.get("/tutors",protect,adminOnly, controller.getAllTutors);
router.get("/tutor-applications",protect,adminOnly, controller.getAllTutorApplications);
router.get("/dashboard-stats",protect,adminOnly, controller.getDashboardStats);
router.patch("/users/:id/toggle",protect,adminOnly,validate(toggleUserSchema), controller.toggleUserStatus);
router.patch("/users/approve/:userId",protect,adminOnly,validate(approveTutorSchema), controller.approveTutor);
router.patch("/users/reject/:userId",protect,adminOnly,validate(rejectTutorSchema), controller.rejectTutor);

export default router;