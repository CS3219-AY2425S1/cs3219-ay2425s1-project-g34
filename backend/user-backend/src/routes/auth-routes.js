import express from "express";

import { 
  handleLogin,
  handleVerifyToken,
  handleVerifyEmail,
  handleResendVerification,
  handleForgetPassword,
  handleVerifyPassword,
} from "../controller/auth-controller.js";
import { verifyAccessToken, verifyEmailToken, verifyPasswordToken } from "../middleware/basic-access-control.js";

const router = express.Router();

router.post("/login", handleLogin);

router.get("/verify-token", verifyAccessToken, handleVerifyToken);

// Verify token for associated email
router.post("/verify-email", verifyEmailToken, handleVerifyEmail);

router.post("/verify-password", verifyPasswordToken, handleVerifyPassword);

// Send verification link to a user
router.post("/resend-verification", handleResendVerification);

router.post("/forget-password", handleForgetPassword);

export default router;
