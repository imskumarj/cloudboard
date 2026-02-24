// src/services/org.service.ts

import { api } from "./api";

export const getProjects = async () => {
  const res = await api.get("/org/projects");
  return res.data;
};

export const getTasks = async (projectId?: string) => {
  const res = await api.get("/org/tasks", {
    params: { projectId },
  });
  return res.data;
};

export const getTeamMembers = async () => {
  const res = await api.get("/org/team");
  return res.data;
};

export const getFiles = async () => {
  const res = await api.get("/org/files");
  return res.data;
};

export const getActivities = async () => {
  const res = await api.get("/org/activities");
  return res.data;
};

export const getProjectMembers = async (projectId: string) => {
  const res = await api.get(`/org/projects/${projectId}/members`);
  return res.data;
};