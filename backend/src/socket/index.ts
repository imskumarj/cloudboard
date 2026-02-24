import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import User from "../models/user.model";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: ENV.FRONTEND_URL,
      credentials: true,
    },
  });

  /**
   * 🔐 Socket Authentication Middleware
   * Validates JWT from cookies before allowing connection
   */
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) {
        return next(new Error("Unauthorized"));
      }

      const token = cookieHeader
        .split("; ")
        .find((c) => c.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const decoded = jwt.verify(
        token,
        ENV.JWT_ACCESS_SECRET
      ) as { userId: string };

      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return next(new Error("Unauthorized"));
      }

      // attach safe user data to socket
      socket.data.user = {
        id: user._id.toString(),
        orgId: user.orgId.toString(),
        role: user.role,
      };

      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    /**
     * 🏢 Join Organization Room (Validated)
     */
    socket.on("join-org", (orgId: string) => {
      if (socket.data.user.orgId !== orgId) {
        console.warn("⚠ Unauthorized room join attempt");
        return;
      }

      socket.join(orgId);
      console.log(`Socket ${socket.id} joined org ${orgId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};