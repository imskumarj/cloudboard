import { Router } from "express";
import { getMe, updateProfile } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/me", getMe);
router.patch("/me", updateProfile);

export default router;