// 3rd party modules
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

// custom util modules
const { BASE_URL } = require("./constants");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");

// route handlers
const cryptoRoutes = require("./routes/cryptoRoutes");

//importing cron job
require("./jobs/coingekoJob");

// initiliasing express app
const app = express();

// Implement CORS
app.use(cors({ origin: "*" }));

// Set security HTTP headers
app.use(helmet());

// Api logging
app.use(morgan("dev"));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["coin"],
  })
);

// routes
app.use(`${BASE_URL}/crypto`, cryptoRoutes);
app.get(`${BASE_URL}/test`, (req, res) => {
  res.status(200).json({ message: "API is working" });
});

// invalid route handler
app.all("*", (req, _, next) =>
  next(new AppError(`The route ${req.originalUrl} does not exists`, 404))
);

// global error handler
app.use(globalErrorHandler);

module.exports = app;
