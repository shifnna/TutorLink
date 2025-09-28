import { Router } from "express";
import container from "../container/inversify.config";
import { IAdminController } from "../controllers/interfaces/IAdminController";
import { TYPES } from "../types/types";
import { adminOnly, protect } from "../middlewares/authMiddleware";

const router = Router();
const controller = container.get<IAdminController>(TYPES.IAdminController)

router.get("/clients",protect,adminOnly, controller.getAllClients.bind(controller));
router.get("/tutors",protect,adminOnly, controller.getAllTutors.bind(controller));
router.get("/tutor-applications",protect,adminOnly, controller.getAllTutorApplications.bind(controller));
router.patch("/users/:id/toggle",protect,adminOnly, controller.toggleUserStatus.bind(controller));
router.patch("/users/approve/:userId",protect,adminOnly, controller.approveTutor.bind(controller));
router.get("/dashboard-stats",protect,adminOnly, controller.getDashboardStats.bind(controller));

export default router;