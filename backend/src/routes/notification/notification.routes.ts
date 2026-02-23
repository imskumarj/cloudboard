import { Router } from "express";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "./notification.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// 🔐 Protect all notification routes
router.use(authMiddleware);

// GET /api/notifications
router.get("/", getNotifications);

// PATCH /api/notifications/:id/read
router.patch("/:id/read", markNotificationRead);

// PATCH /api/notifications/read-all
router.patch("/read-all", markAllNotificationsRead);

// DELETE /api/notifications/:id
router.delete("/:id", deleteNotification);

export default router;