import { Request, Response } from "express";
import User from "../../models/user.model";
import Notification from "../../models/notification.model";

/**
 * GET all members (including pending)
 */
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

/**
 * APPROVE member (admin only)
 */
export const approveMember = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const orgId = (req as any).user?.orgId;

  const user = await User.findOne({ _id: userId, orgId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.approved) {
    return res.status(400).json({ message: "User already approved" });
  }

  user.approved = true;
  await user.save();

  await Notification.create({
    userId: user._id,
    orgId,
    type: "approval",
    title: "Access Approved",
    message: `Your access to the organization has been approved.`,
  });

  res.json({ success: true });
};

/**
 * DECLINE member (admin only)
 */
export const declineMember = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const orgId = (req as any).user?.orgId;
  const currentUserId = (req as any).user?.id;

  if (userId === currentUserId) {
    return res.status(400).json({ message: "You cannot decline yourself" });
  }

  const user = await User.findOne({ _id: userId, orgId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Prevent deleting last admin
  if (user.role === "admin") {
    const adminCount = await User.countDocuments({
      orgId,
      role: "admin",
    });

    if (adminCount <= 1) {
      return res
        .status(400)
        .json({ message: "At least one admin must remain in the organization" });
    }
  }

  await user.deleteOne();

  res.json({ success: true });
};

/**
 * CHANGE ROLE (admin only)
 */
export const changeRole = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { role } = req.body;
  const orgId = (req as any).user?.orgId;
  const currentUserId = (req as any).user?.id;

  if (!["admin", "manager", "member"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  if (userId === currentUserId) {
    return res
      .status(400)
      .json({ message: "You cannot change your own role" });
  }

  const user = await User.findOne({ _id: userId, orgId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Prevent removing last admin
  if (user.role === "admin" && role !== "admin") {
    const adminCount = await User.countDocuments({
      orgId,
      role: "admin",
    });

    if (adminCount <= 1) {
      return res
        .status(400)
        .json({ message: "At least one admin must remain in the organization" });
    }
  }

  user.role = role;
  await user.save();

  res.json({ success: true });
};