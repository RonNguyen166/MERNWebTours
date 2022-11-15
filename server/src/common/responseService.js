import httpStatus from "http-status";
import config from "../config/config.js";
export const successReponse = (req, res, data, message, code = 200) => {
  return (
    !res.headersSent &&
    res
      .status(code)
      .json({ code: code || 200, success: true, message, result: data })
  );
};

export const errorReponseProd = (req, res, err) => {
  return (
    !res.headersSent &&
    res.status(err.code).json({
      code: err.code,
      success: false,
      ...(!req.originalUrl.startsWith("/v1") && {
        title: "Please try again late",
      }),
      message: req.originalUrl.startsWith("/v1")
        ? err.isOperational
          ? err.message
          : "Something went very wrong!"
        : err.isOperational
        ? err.message
        : "Please try again late",
    })
  );
};
export const errorReponseDev = (req, res, err) => {
  return (
    !res.headersSent &&
    res.status(err.code).json({
      code: err.code,
      success: false,
      ...(!req.originalUrl.startsWith("/v1") && {
        title: "Something went wrong!",
      }),
      message: err.message || httpStatus[500],
      ...(req.originalUrl.startsWith("/v1") && { stack: err.stack }),
    })
  );
};
