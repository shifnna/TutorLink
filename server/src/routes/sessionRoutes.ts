import { Router} from "express";
import { protect } from "../middlewares/authMiddleware.js";
import container from "../container/inversify.config.js";
import { ISessionController } from "../controllers/interfaces/ISessionController.js";
import { TYPES } from "../types/types.js";

const router = Router();

const sessionController = container.get<ISessionController>(TYPES.ISessionController)

router.post("/client/book-session",protect, sessionController.bookSession);
router.post("/client/verify-payment",protect, sessionController.verifyPayment);
router.get("/client/sessions",protect, sessionController.getAllSessions);
router.post("/client/sessions/feedback",protect, sessionController.sentFeedback);
router.patch("/client/sessions/cancel/:id",protect, sessionController.cancelSession);
router.get("/client/sessions/:id", protect, sessionController.getSessionById);


export default router;
