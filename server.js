require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const seedData = require("./seed");

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
