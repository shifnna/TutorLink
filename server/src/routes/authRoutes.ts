import { Router } from "express";
import { AuthController } from "../controllers/authController";

const router = Router();

router.post('/signup',AuthController.signup)
router.post("/verify-otp", AuthController.verifyOtp);
router.post("/resend-otp", AuthController.resendOtp);
router.post("/reset-password", AuthController.resetPassword);
router.post('/login',AuthController.login)
router.post('/logout',AuthController.logout)


export default router;