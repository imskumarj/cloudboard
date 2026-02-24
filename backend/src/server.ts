import app from "./app";
import { connectDB } from "./config/db";
import { ENV } from "./config/env";
import http from "http";
import { initSocket } from "./socket";

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  initSocket(server);

  server.listen(ENV.PORT, () => {
    console.log(
      `🚀 Server running on port ${ENV.PORT} in ${ENV.NODE_ENV} mode`
    );
  });
};

startServer();