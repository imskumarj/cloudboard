import { api } from "./api";

export const getTasks = async (projectId?: string) => {
  const res = await api.get("/tasks", {
    params: { projectId },
  });
  return res.data;
};

export const createTask = async (data: any) => {
  const res = await api.post("/tasks", data);
  return res.data;
};

export const updateTask = async (id: string, data: any) => {
  const res = await api.patch(`/tasks/${id}`, data);
  return res.data;
};

export const deleteTask = async (id: string) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};