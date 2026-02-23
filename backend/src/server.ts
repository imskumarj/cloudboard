import app from "./app"
import { connectDB } from "./config/db"
import { ENV } from "./config/env"

const startServer = async () => {
  await connectDB()

  app.listen(ENV.PORT, () => {
    console.log(
      `🚀 Server running on port ${ENV.PORT} in ${ENV.NODE_ENV} mode`
    )
  })
}

startServer()