class AppError extends Error {
  constructor(message, statusCode, errObj) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.errObj = errObj;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
