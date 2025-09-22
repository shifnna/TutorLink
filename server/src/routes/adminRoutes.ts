import { Router } from "express";
import container from "../config/inversify";
import { IAdminController } from "../controllers/interfaces/IAdminController";
import { TYPES } from "../types/types";

const router = Router();
const controller = container.get<IAdminController>(TYPES.IAdminController)

router.get("/users", controller.getAllUsers.bind(controller));
router.get("/tutor-applications", controller.getAllTutors.bind(controller));
router.patch("/users/:id/toggle", controller.toggleUserStatus.bind(controller));
router.patch("/users/approve/:userId", controller.approveTutor.bind(controller));

export default router;
