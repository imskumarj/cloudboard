import { api } from "./api";

export const getProfile = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const updateProfile = async (data: any) => {
  const res = await api.patch("/users/me", data);
  return res.data;
};

export const getNotificationPrefs = async () => {
  const res = await api.get("/notification-preferences");
  return res.data;
};

export const updateNotificationPrefs = async (data: any) => {
  const res = await api.put("/notification-preferences", data);
  return res.data;
};