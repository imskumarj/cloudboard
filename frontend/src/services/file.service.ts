import { api } from "./api";

export const getFiles = async () => {
  const res = await api.get("/files");
  return res.data;
};

export const getUploadUrl = async (data: any) => {
  const res = await api.post("/files/upload-url", data);
  return res.data;
};

export const saveFileMeta = async (data: any) => {
  const res = await api.post("/files", data);
  return res.data;
};

export const deleteFile = async (id: string) => {
  await api.delete(`/files/${id}`);
};