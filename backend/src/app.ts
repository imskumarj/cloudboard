import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"

import { ENV } from "./config/env"
import healthRoutes from "./routes/health.routes"
import { errorHandler } from "./middlewares/error.middleware"
import notificationRoutes from "./routes/notification/notification.routes"

const app = express()

// Security
app.use(helmet())

// CORS
app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    credentials: true
  })
)

// Logging
if (ENV.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/health", healthRoutes)
app.use("/api/notifications", notificationRoutes)

// Global error handler
app.use(errorHandler)

export default app