import { api } from "./api";

export const sendOtp = async (email: string, name: string) => {
  const res = await api.post("/auth/send-otp", { email, name });
  return res.data;
};

export const verifyOtpAndSignup = async (data: {
  name: string;
  email: string;
  password: string;
  orgName?: string;
  inviteCode?: string;
  role: "admin" | "manager" | "member";
  otp: string;
}) => {
  const res = await api.post("/auth/verify-signup", data);
  return res.data;
};