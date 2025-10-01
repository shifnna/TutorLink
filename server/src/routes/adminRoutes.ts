import { Router } from "express";
import container from "../container/inversify.config";
import { IAdminController } from "../controllers/interfaces/IAdminController";
import { TYPES } from "../types/types";
import { adminOnly, protect } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import { approveTutorSchema, rejectTutorSchema, toggleUserSchema } from "../validators/adminValidator";

const router = Router();
const controller = container.get<IAdminController>(TYPES.IAdminController)

router.get("/clients",protect,adminOnly, controller.getAllClients.bind(controller));
router.get("/tutors",protect,adminOnly, controller.getAllTutors.bind(controller));
router.get("/tutor-applications",protect,adminOnly, controller.getAllTutorApplications.bind(controller));
router.get("/dashboard-stats",protect,adminOnly, controller.getDashboardStats.bind(controller));
router.patch("/users/:id/toggle",protect,adminOnly,validate(toggleUserSchema), controller.toggleUserStatus.bind(controller));
router.patch("/users/approve/:userId",protect,adminOnly,validate(approveTutorSchema), controller.approveTutor.bind(controller));
router.patch("/users/reject/:userId",protect,adminOnly,validate(rejectTutorSchema), controller.rejectTutor.bind(controller));

export default router;