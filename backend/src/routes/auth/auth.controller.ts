import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "../../models/user.model";
import Organization from "../../models/organization.model";
import { generateToken } from "../../utils/jwt";

// SIGNUP
export const signup = async (req: Request, res: Response) => {
  const { name, email, password, orgName, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const inviteCode = crypto.randomBytes(4).toString("hex");

  const org = await Organization.create({
    name: orgName,
    inviteCode,
  });

  const user = await User.create({
    name,
    email,
    password: hashed,
    orgId: org._id,
    role,
  });

  const token = generateToken(user._id.toString());

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true in production
    sameSite: "lax",
  });

  res.json({ success: true });
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user._id.toString());

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({ success: true });
};

// LOGOUT
export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ success: true });
};

// ME
export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user?.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const organization = await Organization.findById(user.orgId);

  res.json({
    user: {
      id: user._id,
      email: user.email,
    },
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: "",
      orgId: user.orgId,
      approved: user.approved,
    },
    organization,
    role: user.role,
  });
};