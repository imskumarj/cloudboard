import { Request, Response } from "express";
import User from "../../models/user.model";

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const user = await User.findById(userId).select("-password");

  res.json(user);
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { name, email } = req.body;

  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = name ?? user.name;
  user.email = email ?? user.email;

  await user.save();

  res.json({ success: true });
};