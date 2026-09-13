import { Router } from "express";
import container from "../container/inversify.config.js";
import { IAuthController } from "../controllers/interfaces/IAuthController.js";
import { TYPES } from "../types/types.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, otpSchema, resendOtpSchema, resetPasswordSchema, signupSchema } from "../validators/authValidator.js";
import passport from "passport";

const router = Router();
const controller = container.get<IAuthController>(TYPES.IAuthController)


router.get('/me', protect , controller.getMe.bind(controller))
router.post('/refresh',controller.refresh);
router.post('/signup',validate(signupSchema), controller.signup);          //when using normal functions, .bind(controller) ensures the method always remembers the correct this
router.post('/login',validate(loginSchema), controller.login);             //* arrow or normal function which is best practise ?
router.post("/verify-otp",validate(otpSchema), controller.verifyOtp);    
router.post("/resend-otp",validate(resendOtpSchema), controller.resendOtp);
router.post("/reset-password",validate(resetPasswordSchema), controller.resetPassword);
router.post('/logout', controller.logout);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",passport.authenticate("google", { failureRedirect: "/login" }), controller.googleSignin);

export default router;