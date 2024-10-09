// env files configuration
require("dotenv").config();

// importing modules
const mongoose = require("mongoose");
const app = require("./app");

// uncaught Execption handler
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
});

// DB Connection
mongoose
  .connect(
    process.env.DATABASE_URI.replace(
      "<password>",
      process.env.DATABASE_PASSWORD
    ),
    { autoIndex: true }
  )
  .then(() => console.log("DB Connected Successfully ✅"))
  .catch((err) => console.log(`SERVER ERROR💥: ${err.message}`));

// Server initialization
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening to request on port ${PORT} 👂`);
});

// uncaught rejection handler
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// server close handler
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
