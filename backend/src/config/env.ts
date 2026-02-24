import dotenv from "dotenv"

dotenv.config()

export const ENV = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "",
  MONGO_URI: process.env.MONGO_URI || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:8080",
  SMTP_EMAIL: process.env.SMTP_EMAIL || "",
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || "",
}