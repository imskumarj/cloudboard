import { api } from "./api";

export const getProjects = async () => {
  const res = await api.get("/projects");
  return res.data;
};

export const getTasks = async (projectId?: string) => {
  const res = await api.get("/tasks", {
    params: { projectId },
  });
  return res.data;
};

export const getTeamMembers = async () => {
  const res = await api.get("/users/team");
  return res.data;
};

export const getFiles = async () => {
  const res = await api.get("/files");
  return res.data;
};

export const getActivities = async () => {
  const res = await api.get("/activities");
  return res.data;
};

export const getProjectMembers = async (projectId: string) => {
  const res = await api.get(`/projects/${projectId}/members`);
  return res.data;
};