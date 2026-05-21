import { Router, Request, Response, NextFunction } from "express";
import { protect } from "../middlewares/authMiddleware";
import container from "../container/inversify.config";
import { ISessionController } from "../controllers/interfaces/ISessionController";
import { TYPES } from "../types/types";

const router = Router();

const sessionController = container.get<ISessionController>(TYPES.ISessionController)

router.post("/client/book-session",protect, sessionController.bookSession);
router.post("/client/verify-payment",protect, sessionController.verifyPayment);
router.get("/client/sessions",protect, sessionController.getAllSessions);
router.post("/client/sessions/feedback",protect, sessionController.sentFeedback);
router.patch("/client/sessions/cancel/:id",protect, sessionController.cancelSession);

export default router;
