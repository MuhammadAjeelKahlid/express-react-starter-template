import { Router } from "express";
import { emailSchema, loginSchema, refreshTokenVerificationSchema, signUpSchema, tokenVerificationSchema } from "@/validators/auth.validator";
import { authController } from "@/controllers/auth.controller";
import { validate } from "@/middleware/validate.middleware";
const router = Router();

router.post("/signup", validate(signUpSchema), authController.signUp);
router.post("/login", validate(loginSchema), authController.login);
router.get("/verify-email", validate(tokenVerificationSchema), authController.verifyEmail);
router.get("/reverify-email", validate(emailSchema), authController.resendVerification);
router.post("/refresh-token", validate(refreshTokenVerificationSchema), authController.refreshToken);

export default router; 