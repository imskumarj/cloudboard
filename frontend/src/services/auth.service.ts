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

// 🔹 Login (optional — since AuthContext uses api directly)
export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

// 🔹 Send reset OTP
export const sendResetOtp = async (email: string) => {
  const res = await api.post("/auth/forgot-password/send-otp", { email });
  return res.data;
};

// 🔹 Verify OTP + Reset password
export const resetPassword = async (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  const res = await api.post("/auth/forgot-password/reset", data);
  return res.data;
};