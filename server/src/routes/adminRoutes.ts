import { Router } from "express";
import { AdminController } from "../controllers/adminController";

const router = Router();

router.get("/users", AdminController.getAllUsers);
router.patch("/users/:id/toggle", AdminController.toggleUserStatus);

export default router;
