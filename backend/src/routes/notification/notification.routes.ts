import { Router } from "express";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "./notification.controller";

import { mockAuth } from "../../middlewares/mockAuth.middleware";

const router = Router();

router.use(mockAuth);

router.get("/", getNotifications);
router.patch("/:id/read", markNotificationRead);
router.patch("/read-all", markAllNotificationsRead);
router.delete("/:id", deleteNotification);

export default router;