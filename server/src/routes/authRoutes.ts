import { Router } from "express";
import container from "../container/inversify.config";
import { IAuthController } from "../controllers/interfaces/IAuthController";
import { TYPES } from "../types/types";
import { protect } from "../middlewares/authMiddleware";

const router = Router();
const controller = container.get<IAuthController>(TYPES.IAuthController)


router.get('/me',protect, controller.getMe.bind(controller))
router.post('/signup',controller.signup.bind(controller))           //when using normal functions, .bind(controller) ensures the method always remembers the correct this
router.post("/verify-otp", controller.verifyOtp.bind(controller));        //* arrow or normal function which is best practise ?
router.post("/resend-otp", controller.resendOtp.bind(controller));
router.post("/reset-password", controller.resetPassword.bind(controller));
router.post('/login',controller.login.bind(controller))
router.post('/logout',controller.logout.bind(controller))


export default router;