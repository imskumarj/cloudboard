import { Request, Response } from "express";
import Notification from "../../models/notification.model";

// GET /api/notifications
export const getNotifications = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(notifications);
};

// PATCH /api/notifications/:id/read
export const markNotificationRead = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  await Notification.findOneAndUpdate(
    { _id: id, userId },
    { read: true }
  );

  res.json({ success: true });
};

// PATCH /api/notifications/read-all
export const markAllNotificationsRead = async (
  req: Request,
  res: Response
) => {
  const userId = (req as any).user?.id;

  await Notification.updateMany(
    { userId, read: false },
    { read: true }
  );

  res.json({ success: true });
};

// DELETE /api/notifications/:id
export const deleteNotification = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  await Notification.findOneAndDelete({
    _id: id,
    userId,
  });

  res.json({ success: true });
};