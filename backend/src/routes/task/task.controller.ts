import { Request, Response } from "express";
import Task from "../../models/task.model";
import { getIO } from "../../socket";

// GET tasks
export const getTasks = async (req: Request, res: Response, next: any) => {
  try {
    const { projectId } = req.query;

    const filter: any = { orgId: (req as any).user?.orgId };

    if (projectId && projectId !== "all") {
      filter.projectId = projectId;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    const formatted = tasks.map((t) => ({
      id: t._id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      project_id: t.projectId,
      assignee_id: t.assignedTo,
      due_date: t.dueDate,
      tags: t.tags || [],
      created_at: t.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};

// CREATE task (admin + manager)
export const createTask = async (req: Request, res: Response) => {
  const task = await Task.create({
    ...req.body,
    orgId: (req as any).user?.orgId,
    createdBy: (req as any).user?.id,
  });

  const formatted = {
    id: task._id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    project_id: task.projectId,
    assignee_id: task.assignedTo,
    due_date: task.dueDate,
    tags: task.tags || [],
    created_at: task.createdAt,
  };

  const io = getIO();

  io.to((req as any).user?.orgId).emit("task-created", formatted);

  res.status(201).json(formatted);
};

// UPDATE task (admin + manager)
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  const task = await Task.findOneAndUpdate(
    { _id: id, orgId: (req as any).user?.orgId },
    req.body,
    { new: true }
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const formatted = {
    id: task._id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    project_id: task.projectId,
    assignee_id: task.assignedTo,
    due_date: task.dueDate,
    tags: task.tags || [],
    created_at: task.createdAt,
  };

  const io = getIO();

  io.to((req as any).user?.orgId).emit("task-updated", formatted);

  res.json(formatted);
};

// DELETE task (admin only)
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deleted = await Task.findOneAndDelete({
    _id: id,
    orgId: (req as any).user?.orgId,
  });

  if (!deleted) {
    return res.status(404).json({ message: "Task not found" });
  }

  const io = getIO();

  io.to((req as any).user?.orgId).emit("task-deleted", { id });

  res.json({ success: true });
};
