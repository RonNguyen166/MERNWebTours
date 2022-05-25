import catchAsync from "../utils/catchAsync";
import User from "../models/userModel";
import * as token from "../utils/token";
import config from "../config/config";
import Token from "../models/tokenModel";
import ApiError from "../utils/ApiError";
import * as Email from "../utils/Email";
import tokenTypes from "../config/tokenTypes";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

const createSendCookie = (token, user, statusCode, req, res) => {
  res.cookie("jwt", token, {
    expries: new Date(
      Date.now() + config.jwt.cookieExpirationDays * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
  });
};

const register = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  const tokens = (await token.ge) / nerateAuthTokens(user);
  // sendVerificationEmail();
  createSendCookie(tokens.refresh.token, user, 201, req, res);
});

const login = catchAsync(async (req, res, next) => {
  const { login, password } = req.body;
  if (!login || !password)
    return next(new ApiError("Please provide email and password", 400));

  const user = await User.findOne(
    login.match(/@/) ? { email: login } : { username: login }
  ).select("+password");
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new ApiError("Incorrect email or password", 401));
  // if (!user.email)
  //   return next(new ApiError("User has not verified email", 401));
  const tokens = await token.generateAuthTokens(user);
  createSendCookie(tokens.refresh.token, user, 200, req, res);
});

const logout = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.jwt;
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) return next(new ApiError("Not Found", 401));
  refreshTokenDoc.remove();
  res.clearCookie("jwt");
  res.status(200).json({ status: "success" });
});

const refreshTokens = catchAsync(async (req, res, next) => {
  try {
    const refreshTokenDoc = await token.verifyToken(
      req.body.refreshToken,
      tokenTypes.REFRESH
    );
    const user = await User.findById(refreshTokenDoc.user);
    if (!user) return next(new ApiError("User not found", 401));
    await refreshTokenDoc.remove();
    const tokens = await token.generateAuthTokens(user);
    res.status(200).json({
      status: "success",
      ...tokens,
    });
  } catch (err) {
    return next(new ApiError("Please authenticate"));
  }
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ApiError("No users found with this email"));
  const expries = new Date(
    Date.now() + config.jwt.resetPasswordExpirationMinutes * 60 * 1000
  );
  const resetPasswordToken = token.generateToken(
    user.id,
    expries,
    tokenTypes.RESET_PASSWORD
  );
  await token.saveToken(
    resetPasswordToken,
    user.id,
    expries,
    tokenTypes.RESET_PASSWORD
  );
  await Email.sendResetPasswordEmail(user, resetPasswordToken);
  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  try {
    const resetPasswordTokenDoc = await token.verifyToken(
      req.query.token,
      tokenTypes.RESET_PASSWORD
    );
    const user = await User.findOne(resetPasswordTokenDoc.user);
    if (!user)
      return next(new ApiError("Token is invalid or has expired", 400));
    1;
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
    const tokens = await token.generateAuthTokens(user);
    createSendCookie(tokens.refresh.token, user, 200, req, res);
  } catch (err) {
    return next(new ApiError("Password reset failed"));
  }
});

const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new ApiError("Your current password is wrong.", 401));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  const tokens = await token.generateAuthTokens(user);
  createSendCookie(tokens.refresh.token, user, req, res);
});

const sendVerificationEmail = catchAsync(async (req, res, next) => {
  const verifyEmailToken = await token.generateVerifyEmailToken(req.user);
  await Email.sendVerificationEmail(req.user, verifyEmailToken);
  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});

const verifyEmail = catchAsync(async (req, res, next) => {
  try {
    const verifyEmailTokenDoc = await Token.verifyToken(
      req.query.token,
      tokenTypes.VERIFY_EMAIL
    );
    const user = await User.findById(verifyEmailTokenDoc.user);
    if (!user) return next(new ApiError("User not found", 404));

    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await User.findByIdAndUpdate(user.id, { isEmailVerified: true });
    const tokens = await token.generateAuthTokens(user);
    createSendCookie(tokens.refresh.token, user, 201, req, res);
  } catch (err) {
    return next(new ApiError("Email verification failed", 401));
  }
});

const client = new OAuth2Client(config.googleClient.oauth2ClientID);

const googleLogin = catchAsync(async (req, res, next) => {
  const { idToken } = req.body;
  const verify = await client.verifyIdToken({
    idToken,
    audience: config.googleClient.oauth2ClientID,
  });
  const { email_verified, name, email, picture } = verify.payload;
  const password = email + config.googleClient.oauth2ClientID;
  if (!email_verified)
    return next(new ApiError("Email verification failed.", 400));

  const user = await User.findOne({ email });
  if (user) {
    if (!user.correctPassword(password, user.password))
      return next(new ApiError("Password is incorrect.", 400));

    const tokens = await token.generateAuthTokens(user);
    createSendCookie(tokens.refresh.token, user, 200, req, res);
  } else {
    const user = await User.create({
      name,
      email,
      username: email,
      photo: picture,
      password,
      passwordConfirm: password,
    });
    const tokens = await token.generateAuthTokens(user);
    createSendCookie(tokens.refresh.token, user, 200, req, res);
  }
});

const facebookLogin = catchAsync(async (req, res, next) => {
  const { accessToken, userID } = req.body;
  const url = `https://graph.facebook.com/v4.0/${userID}?fields=id,name,email,picture&access_token=${accessToken}`;
  const data = await axios({
    method: "GET",
    url,
  });

  const { email, name, picture } = data;
  const password = email + config.facebookSecret;

  const user = await User.findOne({ email });
  if (user) {
    if (!user.correctPassword(password, user.password))
      return next(new ApiError("Password is incorrect.", 400));
    const tokens = await token.generateAuthTokens(user);
    createSendCookie(tokens.refresh.token, user, 200, req, res);
  } else {
    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm: password,
      photo: picture.data.url,
    });
    const tokens = await token.generateAuthTokens(user);
    createSendCookie(tokens.refresh.token, user, 200, req, res);
  }
});

export {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  updatePassword,
  sendVerificationEmail,
  verifyEmail,
  googleLogin,
  facebookLogin,
};
