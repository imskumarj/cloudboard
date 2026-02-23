import { Request, Response } from "express";
import Task from "../../models/task.model";

// GET tasks
export const getTasks = async (req: Request, res: Response) => {
  const { projectId } = req.query;

  const filter: any = { orgId: (req as any).user?.orgId };

  if (projectId && projectId !== "all") {
    filter.projectId = projectId;
  }

  const tasks = await Task.find(filter).sort({ createdAt: -1 });

  res.json(tasks);
};

// CREATE task (admin + manager)
export const createTask = async (req: Request, res: Response) => {
  const task = await Task.create({
    ...req.body,
    orgId: (req as any).user?.orgId,
    createdBy: (req as any).user?.id,
  });

  res.status(201).json(task);
};

// UPDATE task (admin + manager)
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  const task = await Task.findOneAndUpdate(
    { _id: id, orgId: (req as any).user?.orgId },
    req.body,
    { new: true }
  );

  res.json(task);
};

// DELETE task (admin only)
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Task.findOneAndDelete({
    _id: id,
    orgId: (req as any).user?.orgId,
  });

  res.json({ success: true });
};