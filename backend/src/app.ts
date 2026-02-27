import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import compression from "compression";

import { ENV } from "./config/env"
import healthRoutes from "./routes/health.routes"
import { errorHandler } from "./middlewares/error.middleware"
import notificationRoutes from "./routes/notification/notification.routes"
import authRoutes from "./routes/auth/auth.routes"
import orgRoutes from "./routes/org/org.routes"
import projectRoutes from "./routes/project/project.routes"
import taskRoutes from "./routes/task/task.routes"
import teamRoutes from "./routes/team/team.routes"
import userRoutes from "./routes/user/user.routes";
import notificationPrefRoutes from "./routes/notificationPreference/notificationPref.routes";
import fileRoutes from "./routes/file/file.routes";

const app = express()

// Security
app.use(helmet())

// Global API Rate Limit
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // 300 requests per IP
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(compression());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // max 20 login attempts
});

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
app.use(cookieParser());

// Routes
app.use("/api/health", healthRoutes)
app.use("/api/auth", authLimiter, authRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/org", orgRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/team", teamRoutes)
app.use("/api/user", userRoutes);
app.use("/api/notification-preferences", notificationPrefRoutes);
app.use("/api/files", fileRoutes);

// Global error handler
app.use(errorHandler)

export default app