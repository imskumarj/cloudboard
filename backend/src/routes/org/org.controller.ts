import { Request, Response } from "express";
import Organization from "../../models/organization.model";
import User from "../../models/user.model";
import Project from "../../models/project.model";
import Task from "../../models/task.model";
import File from "../../models/file.model";
import Activity from "../../models/activity.model";

// GET organization info
export const getOrganization = async (req: Request, res: Response) => {
  const org = await Organization.findById((req as any).user?.orgId);
  if (!org) {
    return res.status(404).json({ message: "Organization not found" });
  }

  res.json(org);
};

// UPDATE organization (admin only)
export const updateOrganization = async (req: Request, res: Response) => {
  const org = await Organization.findByIdAndUpdate(
    (req as any).user?.orgId,
    req.body,
    { new: true }
  );

  res.json(org);
};

// GET team members
export const getTeamMembers = async (req: Request, res: Response) => {
  const members = await User.find({ orgId: (req as any).user?.orgId }).select(
    "-password"
  );

  res.json(members);
};

export const getProjects = async (req: Request, res: Response) => {
  const orgId = (req as any).user?.orgId;

  const projects = await Project.find({ orgId }).sort({
    createdAt: -1,
  });

  res.json(projects);
};

export const getTasks = async (req: Request, res: Response) => {
  const orgId = (req as any).user?.orgId;
  const { projectId } = req.query;

  const filter: any = { orgId };

  if (projectId && projectId !== "all") {
    filter.projectId = projectId;
  }

  const tasks = await Task.find(filter).sort({
    createdAt: -1,
  });

  res.json(tasks);
};

export const getFiles = async (req: Request, res: Response) => {
  const orgId = (req as any).user?.orgId;

  const files = await File.find({ orgId }).sort({
    createdAt: -1,
  });

  res.json(files);
};

export const getActivities = async (req: Request, res: Response) => {
  const orgId = (req as any).user?.orgId;

  const activities = await Activity.find({ orgId })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(activities);
};

export const getProjectMembers = async (
  req: Request,
  res: Response
) => {
  const orgId = (req as any).user?.orgId;
  const { id } = req.params;

  const tasks = await Task.find({
    orgId,
    projectId: id,
  }).select("assignedTo");

  const userIds = tasks
    .map((t) => t.assignedTo)
    .filter(Boolean);

  const members = await User.find({
    _id: { $in: userIds },
  }).select("-password");

  res.json(members);
};