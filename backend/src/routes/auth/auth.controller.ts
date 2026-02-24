import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "../../models/user.model";
import Organization from "../../models/organization.model";
import OTP from "../../models/otp.model";
import { generateToken } from "../../utils/jwt";
import { sendOtpEmail } from "../../utils/mailer";

// 🔹 SEND OTP
export const sendOtp = async (req: Request, res: Response) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await OTP.create({
    email,
    code,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendOtpEmail(email, name || "User", code);

  res.json({ success: true });
};

// 🔹 VERIFY OTP + SIGNUP
export const verifySignup = async (req: Request, res: Response) => {
  const { name, email, password, orgName, inviteCode, role, otp } =
    req.body;

  const otpRecord = await OTP.findOne({ email, code: otp });

  if (!otpRecord) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  await OTP.deleteMany({ email });

  const hashed = await bcrypt.hash(password, 10);

  let orgId;

  if (role === "admin") {
    const invite = crypto.randomBytes(4).toString("hex").toUpperCase();

    const org = await Organization.create({
      name: orgName,
      inviteCode: invite,
    });

    orgId = org._id;
  } else {
    const org = await Organization.findOne({
      inviteCode: inviteCode?.toUpperCase(),
    });

    if (!org) {
      return res.status(400).json({ message: "Invalid invite code" });
    }

    orgId = org._id;
  }

  const user = await User.create({
    name,
    email,
    password: hashed,
    orgId,
    role,
    approved: role === "admin",
  });

  const token = generateToken(user._id.toString());

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
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