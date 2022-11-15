export default class ApiError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.success = `${code}`.startsWith(4) ? true : false;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
