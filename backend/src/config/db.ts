import mongoose from "mongoose"
import { ENV } from "./env"

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI)
    console.log("✅ MongoDB connected")
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    process.exit(1)
  }
}