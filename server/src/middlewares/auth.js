import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import { promisify } from "util";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import tokenTypes from "../config/tokenTypes.js";
import httpStatus from "http-status";

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You do not have permission to perform this action.", 403)
      );
    }
    next();
  };
};

const auth = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    return next(
      new ApiError(
        "You are not Logged In! Please log in to get access.",
        httpStatus.UNAUTHORIZED
      )
    );

  const decoded = await promisify(jwt.verify)(token, config.jwt.secret);
  if (decoded.type !== tokenTypes.ACCESS)
    return next(
      new ApiError("Invalid Authentication.", httpStatus.UNAUTHORIZED)
    );

  const user = await User.findById(decoded.sub);
  if (!user)
    return next(
      new ApiError(
        "The user belonging to this does no longer exist",
        httpStatus.UNAUTHORIZED
      )
    );
  if (user.changedPasswordAfter(decoded.iat))
    return next(
      new ApiError(
        "User recently changed password! Please log in again",
        httpStatus.UNAUTHORIZED
      )
    );
  req.user = user;
  next();
});

export { auth, restrictTo };
