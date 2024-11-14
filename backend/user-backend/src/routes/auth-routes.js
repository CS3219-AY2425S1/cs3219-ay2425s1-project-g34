import express from "express";
import { 
  handleLogin,
  handleVerifyToken,
  handleVerifyEmail,
  handleResendVerification,
  handleForgetPassword,
  handleVerifyOtp,
  handleResendOtp,
} from "../controller/auth-controller.js";
import { verifyAccessToken, verifyEmailToken, } from "../middleware/basic-access-control.js";

const router = express.Router();

router.post("/login", handleLogin);

router.get("/verify-token", verifyAccessToken, handleVerifyToken);

router.post("/verify-email", verifyEmailToken, handleVerifyEmail);

router.post("/resend-verification", handleResendVerification);

router.post("/forget-password", handleForgetPassword);

router.post("/forget-password/confirm-otp", handleVerifyOtp);

router.post('/forget-password/resend-otp', handleResendOtp);

export default router;
