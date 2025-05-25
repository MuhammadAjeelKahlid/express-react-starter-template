import { Router } from "express";
import { emailSchema, loginSchema, refreshTokenVerificationSchema, userSchema, tokenVerificationSchema, changePasswordRequest } from "@/validators/auth.validator";
import { authController } from "@/controllers/auth.controller";
import { validate } from "@/middleware/validate.middleware";
import { authCheck } from "@/middleware/authCheck.middleware";
const router = Router();

router.post("/signup", validate(userSchema), authController.signUp);
router.post("/login", validate(loginSchema), authController.login);
router.get("/verify-email", validate(tokenVerificationSchema), authController.verifyEmail);
router.get("/resend-verification-token", validate(emailSchema), authController.resendVerification);
router.post("/refresh-token", validate(refreshTokenVerificationSchema), authController.refreshToken);
router.post("/change-password", validate(changePasswordRequest), authCheck(), authController.changePassword);
router.post("/forgot-password", validate(emailSchema), authController.forgotPassword);
router.post("/reset-password", validate(tokenVerificationSchema), authController.resetPassword);

export default router; 