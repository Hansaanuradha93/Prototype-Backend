import dotenv from "dotenv";

/// Require the app
import app from "./app.js";

/// Handle all uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 SHUTTING DOWN...");
  console.error(err.name, err.message);
  process.exit(1);
});

/// Path for application configuration
dotenv.config();

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on port ${port}...`);
});

/// Handle all unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 SHUTTING DOWN...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
