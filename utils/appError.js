export default class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    // Custom properties
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    // Captures the stack trace without including this constructor
    Error.captureStackTrace(this, this.constructor);
  }
}
