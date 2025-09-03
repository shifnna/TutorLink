import { Router } from "express";
import { AuthController } from "../middlewares/authController";

const router = Router();

router.post('/signup',AuthController.signup)
router.post("/verify-otp", AuthController.verifyOtp);
router.post('/login',AuthController.login)

export default router;