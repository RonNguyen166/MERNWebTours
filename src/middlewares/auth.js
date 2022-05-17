import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import { promisify } from "util";
import config from "../config/config";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new ApiError("You do not have permission to perform this action.", 403)
      );
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
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(
      new ApiError("You are not Logged In! Please log in to get access.", 401)
    );

  const decoded = await promisify(jwt.verify)(token, config.jwt.secret);
  const user = await User.findById(decoded.sub);
  if (!user)
    return next(
      new ApiError("The user belonging to this does no longer exist", 401)
    );
  if (user.changedPasswordAfter(decoded.iat))
    return next(
      new ApiError("User recently changed password! Please log in again", 401)
    );

  req.user = user;
  res.locals.user = user;
  next();
});

const isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = promisify(jwt.verify)(req.cookies.jwt, config.jwt.secret);
      const user = await User.findById(decoded.sub);
      if (!user) return next();
      if (user.changedPasswordAfter(decoded.iat)) return next();
      res.locals.user = user;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

export { auth, isLoggedIn, restrictTo };
