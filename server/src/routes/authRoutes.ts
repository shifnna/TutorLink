import { Router } from "express";
import container from "../container/inversify.config";
import { IAuthController } from "../controllers/interfaces/IAuthController";
import { TYPES } from "../types/types";
import { protect } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import { loginSchema, otpSchema, resendOtpSchema, resetPasswordSchema, signupSchema } from "../validators/authValidator";
import passport from "passport";

const router = Router();
const controller = container.get<IAuthController>(TYPES.IAuthController)


router.get('/me',protect, controller.getMe.bind(controller))

router.post('/signup',validate(signupSchema), controller.signup.bind(controller));          //when using normal functions, .bind(controller) ensures the method always remembers the correct this
router.post('/login',validate(loginSchema), controller.login.bind(controller));             //* arrow or normal function which is best practise ?
router.post("/verify-otp",validate(otpSchema), controller.verifyOtp.bind(controller));    
router.post("/resend-otp",validate(resendOtpSchema), controller.resendOtp.bind(controller));
router.post("/reset-password",validate(resetPasswordSchema), controller.resetPassword.bind(controller));
router.post('/logout', controller.logout.bind(controller));
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",passport.authenticate("google", { failureRedirect: "/login" }), controller.googleSignin.bind(controller));

export default router;