require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

// Only connect to DB and start listening in non-serverless environments
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;

  process.on("unhandledRejection", (err) => {
    console.log(`Unhandled Rejection: ${err.message}`);
    process.exit(1);
  });

  async function initServer() {
    try {
      await connectDB();

      app.listen(PORT, () => {
        console.log(
          `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
        );
      });
    } catch (err) {
      console.error(`Server startup error: ${err.message}`);
      process.exit(1);
    }
  }

  initServer();
} else {
  // For Vercel serverless, connect to DB at module load time
  connectDB().catch(err => {
    console.error("Failed to connect to MongoDB on Vercel:", err.message);
  });

  const serverless = require("serverless-http");
  module.exports = serverless(app);
}
