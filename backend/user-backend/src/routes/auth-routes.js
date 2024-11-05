import express from "express";

import { handleLogin, handleVerifyToken, handleVerifyEmailToken, handleResendVerification } from "../controller/auth-controller.js";
import { verifyAccessToken } from "../middleware/basic-access-control.js";

const router = express.Router();

router.post("/login", handleLogin);

router.get("/verify-token", verifyAccessToken, handleVerifyToken);

// Verify token for associated account
router.post("/verify-email", handleVerifyEmailToken);

// Send verification link to a user
router.post("/resend-verification", handleResendVerification);

export default router;
