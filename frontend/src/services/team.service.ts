import { api } from "./api";

export const getTeamMembers = async () => {
  const res = await api.get("/team");
  return res.data;
};

export const approveMember = async (userId: string) => {
  const res = await api.patch(`/team/${userId}/approve`);
  return res.data;
};

export const declineMember = async (userId: string) => {
  const res = await api.delete(`/team/${userId}/decline`);
  return res.data;
};

export const changeRole = async (userId: string, role: string) => {
  const res = await api.patch(`/team/${userId}/role`, { role });
  return res.data;
};