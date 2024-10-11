// importing utils modules
const AppError = require("../utils/AppError");

// send dev errors function (for developement purpose)
const sendDevError = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    name: err.name,
    code: err.code,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

// send production meaningfull errors function (for production purpose)
const sendProdError = (err, res) => {
  if (err.isOperational) {
    return res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message, error: err.errObj });
  } else {
    console.log(err + "💥");

    // unhandled errors response
    return res.status(500).json({
      status: "error",
      message: "something went really wrong 😢. We are working on it 🛠.",
    });
  }
};

// handling validations error
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// handle JSON syntax errors
const handleJSONError = () => new AppError("Invalid JSON format", 400);

// global error handler
module.exports = (err, req, res, next) => {
  // setting defaults
  err.statusCode ||= 500;
  err.status ||= "error";

  if (process.env.NODE_ENV === "dev") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "prod") {
    let error = Object.assign(err);

    if (error instanceof SyntaxError && "body" in error)
      error = handleJSONError();

    if (!(error instanceof ValidationError) && error.name === "ValidationError")
      error = handleValidationError(error);

    sendProdError(error, res);
  }
};
