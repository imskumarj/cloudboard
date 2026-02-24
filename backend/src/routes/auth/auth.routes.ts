import { Router } from "express";
import {
  sendOtp,
  verifySignup,
  login,
  logout,
  getMe,
  sendResetOtp,
  resetPassword,
} from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/send-otp", sendOtp);
router.post("/verify-signup", verifySignup);

router.post("/forgot-password/send-otp", sendResetOtp);
router.post("/forgot-password/reset", resetPassword);

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);

export default router;