import { api } from "./api";

export const getTeamMembers = async () => {
  const res = await api.get("/team");
  return res.data;
};

export const approveMember = async (userId: string) => {
  return api.patch(`/team/${userId}/approve`);
};

export const declineMember = async (userId: string) => {
  return api.delete(`/team/${userId}`);
};

export const changeRole = async (userId: string, role: string) => {
  return api.patch(`/team/${userId}/role`, { role });
};
