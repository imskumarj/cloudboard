import { Request, Response } from "express";
import Organization from "../../models/organization.model";
import User from "../../models/user.model";

// GET organization info
export const getOrganization = async (req: Request, res: Response) => {
  const org = await Organization.findById(req.user?.orgId);
  if (!org) {
    return res.status(404).json({ message: "Organization not found" });
  }

  res.json(org);
};

// UPDATE organization (admin only)
export const updateOrganization = async (req: Request, res: Response) => {
  const org = await Organization.findByIdAndUpdate(
    req.user?.orgId,
    req.body,
    { new: true }
  );

  res.json(org);
};

// GET team members
export const getTeamMembers = async (req: Request, res: Response) => {
  const members = await User.find({ orgId: req.user?.orgId }).select(
    "-password"
  );

  res.json(members);
};