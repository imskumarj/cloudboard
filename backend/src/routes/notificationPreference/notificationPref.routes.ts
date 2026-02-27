import { Router } from "express";
import {
  getPrefs,
  updatePrefs,
} from "./notificationPref.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getPrefs);
router.put("/", updatePrefs);

export default router;