import { Request, Response } from "express";
import NotificationPreference from "../../models/notificationPreference.model";

export const getPrefs = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  let prefs = await NotificationPreference.findOne({ userId });

  if (!prefs) {
    prefs = await NotificationPreference.create({ userId });
  }

  res.json(prefs);
};

export const updatePrefs = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const prefs = await NotificationPreference.findOneAndUpdate(
    { userId },
    req.body,
    { new: true, upsert: true }
  );

  res.json(prefs);
};