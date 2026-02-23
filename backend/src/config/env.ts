import dotenv from "dotenv"

dotenv.config()

export const ENV = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "",
  MONGO_URI: process.env.MONGO_URI || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:8080"
}