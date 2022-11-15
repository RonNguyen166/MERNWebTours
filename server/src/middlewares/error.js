import ApiError from "../utils/ApiError.js";
import config from "../config/config.js";
import {
  errorReponseDev,
  errorReponseProd,
} from "../common/responseService.js";
import httpStatus from "http-status";
// Xử lý lỗi đường truyền
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new ApiError(message, httpStatus.BAD_REQUEST);
};
// Xử lý lỗi trường trùng nhau
const handleDuplicateError = (err) => {
  const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
  const message = `Duplicate field value: ${value}, Please use anthor value`;
  return new ApiError(message, httpStatus.BAD_REQUEST);
};
// Xử lý lỗi validiton
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new ApiError(message, httpStatus.BAD_REQUEST);
};

const handleJWTError = () =>
  new ApiError("Invalid token. Pleas log in again!", httpStatus.UNAUTHORIZED);

const handleJWTExpriedError = () =>
  new ApiError(
    "Your token has expried! Please log in again!",
    httpStatus.UNAUTHORIZED
  );

// const sendErrorDev = (err, req, res) => {
//   if (req.originalUrl.startsWith("/v1")) {
//     return res.status(err.code).json({
//       code: err.code,
//       status: err.status,
//       error: err,
//       message: err.message,
//       stack: err.stack,
//     });
//   } else {
//     console.error("ERROR", err);
//     return res.status(err.code).json({
//       code: err.code,
//       status: err.status,
//       title: "Something went wrong!",
//       msg: err.message,
//     });
//   }
// };
// const sendErrorProd = (err, req, res) => {
//   if (req.originalUrl.startsWith("/v1")) {
//     if (err.isOperational) {
//       return res.status(err.code).json({
//         code: err.code,
//         status: err.status,
//         message: err.message,
//       });
//     }
//     console.error("ERROR", err);
//     return res.status(500).json({
//       code: err.code,
//       status: err.status,
//       message: "Something went very wrong!",
//     });
//   }
//   if (err.isOperational) {
//     return res.status(err.code).json({
//       code: err.code,
//       status: err.status,
//       title: "Something went wrong!",
//       msg: err.message,
//     });
//   }

//   console.error("ERROR", err);
//   res.status(err.code).json({
//     code: err.code,
//     status: err.status,
//     title: "Something went wrong!",
//     msg: "Please try again late",
//   });
// };

export default function errorHandler(err, req, res, next) {
  err.code = err.code || 500;
  let error = { ...err };
  error.message = err.message;
  if (err.name === "CastError") error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateError(err);
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpriedError();
  if (config.env == "development") return errorReponseDev(req, res, error);
  return errorReponseProd(req, res, error);
}
