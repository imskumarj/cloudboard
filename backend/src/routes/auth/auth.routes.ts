import { Router } from "express";
import {
  sendOtp,
  verifySignup,
  login,
  logout,
  getMe,
} from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/send-otp", sendOtp);
router.post("/verify-signup", verifySignup);

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);

export default router;