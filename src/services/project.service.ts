import { api } from "./api";

export const createProject = async (data: {
  name: string;
  description?: string;
}) => {
  const res = await api.post("/projects", data);
  return res.data;
};

export const updateProject = async (id: string, data: any) => {
  const res = await api.patch(`/projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (id: string) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
};