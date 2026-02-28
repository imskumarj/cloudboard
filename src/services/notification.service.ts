import { api } from "./api";

export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

export const markNotificationRead = async (id: string) => {
  await api.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = async () => {
  await api.patch("/notifications/read-all");
};

export const deleteNotificationById = async (id: string) => {
  await api.delete(`/notifications/${id}`);
};