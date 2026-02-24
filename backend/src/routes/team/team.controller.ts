import { Request, Response } from "express";
import User from "../../models/user.model";
import Notification from "../../models/notification.model";

// GET all members (including pending)
export const getTeamMembers = async (req: Request, res: Response) => {
  const orgId = (req as any).user?.orgId;

  const members = await User.find({ orgId }).select("-password");

  res.json(
    members.map((m) => ({
      id: m._id,
      user_id: m._id,
      name: m.name,
      email: m.email,
      role: m.role,
      approved: m.approved,
    }))
  );
};

// APPROVE member (admin only)
export const approveMember = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const orgId = (req as any).user?.orgId;

  const user = await User.findOneAndUpdate(
    { _id: userId, orgId },
    { approved: true },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await Notification.create({
    userId: user._id,
    orgId,
    type: "approval",
    title: "Access Approved",
    message: `Your access to the organization has been approved.`,
  });

  res.json({ success: true });
};

// DECLINE member (admin only)
export const declineMember = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const orgId = (req as any).user?.orgId;

  const user = await User.findOneAndDelete({
    _id: userId,
    orgId,
    approved: false,
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ success: true });
};

// CHANGE ROLE (admin only)
export const changeRole = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { role } = req.body;
  const orgId = (req as any).user?.orgId;

  if (!["admin", "manager", "member"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findOneAndUpdate(
    { _id: userId, orgId },
    { role },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ success: true });
};