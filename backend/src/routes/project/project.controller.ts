import { Request, Response } from "express";
import Project from "../../models/project.model";

// GET all projects
export const getProjects = async (req: Request, res: Response) => {
  const projects = await Project.find({ orgId: req.user?.orgId }).sort({
    createdAt: -1,
  });

  res.json(projects);
};

// CREATE project (admin + manager)
export const createProject = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    orgId: req.user?.orgId,
    createdBy: req.user?.id,
  });

  res.status(201).json(project);
};

// UPDATE project (admin + manager)
export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  const project = await Project.findOneAndUpdate(
    { _id: id, orgId: req.user?.orgId },
    req.body,
    { new: true }
  );

  res.json(project);
};

// DELETE project (admin only)
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Project.findOneAndDelete({
    _id: id,
    orgId: req.user?.orgId,
  });

  res.json({ success: true });
};