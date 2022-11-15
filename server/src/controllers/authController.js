import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import * as token from "../utils/token.js";
import config from "../config/config.js";
import Token from "../models/tokenModel.js";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import * as Email from "../utils/Email.js";
import tokenTypes from "../config/tokenTypes.js";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import { successReponse } from "../common/responseService.js";

// const createSendCookie = (token, user, statusCode, req, res) => {
//   // res.cookie("jwt", token.refresh.token, {
//   //   expries: new Date(
//   //     Date.now() + config.jwt.cookieExpirationDays * 24 * 60 * 60 * 1000
//   //   ),
//   //   httpOnly: true,
//   //   secure: req.secure || req.headers["x-forwarded-proto"] === "https",
//   // });
//   user.password = undefined;
//   res.status(statusCode).json({
//     status: "success",
//     user,
//     accessToken: token.access.token,
//     refreshToken: token.refresh.token,
//   });
// };

const register = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  const tokens = await token.generateAuthTokens(user);
  // sendVerificationEmail();
  user.password = undefined;
  successReponse(req, res, { user, ...tokens }, "Resgister Successfully!");
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(
      new ApiError("Please provide email and password", httpStatus.BAD_REQUEST)
    );
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password)))
    return next(
      new ApiError("Incorrect email or password", httpStatus.UNAUTHORIZED)
    );
  // if (!user.isEmailVerified)
  //   return next(new ApiError("User has not verified email", 401));
  const tokens = await token.generateAuthTokens(user);
  user.password = undefined;
  successReponse(req, res, { user, ...tokens }, "Login Successfully!");
});

const logout = catchAsync(async (req, res, next) => {
  const token = req.body.refreshToken;
  const refreshTokenDoc = await Token.findOne({
    token,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc)
    return next(new ApiError("Not Found", httpStatus.UNAUTHORIZED));
  refreshTokenDoc.remove();
  successReponse(req, res, null, null, 204);
});

const refreshTokens = catchAsync(async (req, res, next) => {
  try {
    const refreshTokenDoc = await token.verifyToken(
      req.body.refreshToken,
      tokenTypes.REFRESH
    );
    const user = await User.findById(refreshTokenDoc.user);
    if (!user) throw new Error();

    const tokens = await token.generateAuthTokens(user, refreshTokenDoc);
    successReponse(req, res, { ...tokens }, "Refresh Token Successful!");
  } catch (err) {
    return next(new ApiError("Please authenticate"));
  }
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ApiError("No users found with this email"));
  const expires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    "minutes"
  );
  const resetPasswordToken = generateToken(
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  await token.saveToken(
    resetPasswordToken,
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  await Email.sendResetPasswordEmail(user, resetPasswordToken);
  successReponse(req, res, null, null, httpStatus.NO_CONTENT);
});

const resetPassword = catchAsync(async (req, res, next) => {
  try {
    const resetPasswordTokenDoc = await token.verifyToken(
      req.query.token,
      tokenTypes.RESET_PASSWORD
    );
    const user = await User.findOne(resetPasswordTokenDoc.user);
    if (!user) throw new Error();
    1;
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
    const tokens = await token.generateAuthTokens(user);
    successReponse(req, res, null, null, httpStatus.NO_CONTENT);
  } catch (err) {
    return next(new ApiError("Password reset failed"));
  }
});

const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.correctPassword(req.body.passwordCurrent)))
    return next(
      new ApiError("Your current password is wrong.", httpStatus.UNAUTHORIZED)
    );
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  const tokens = await token.generateAuthTokens(user);
  user.password = undefined;
  successReponse(
    req,
    res,
    { user, ...tokens },
    "Your Password updated successfully"
  );
});

const sendVerificationEmail = catchAsync(async (req, res, next) => {
  const verifyEmailToken = await token.generateVerifyEmailToken(req.user);
  await Email.sendVerificationEmail(req.user, verifyEmailToken);
  successReponse(req, res, null, null, httpStatus.NO_CONTENT);
});

const verifyEmail = catchAsync(async (req, res, next) => {
  try {
    const verifyEmailTokenDoc = await Token.verifyToken(
      req.query.token,
      tokenTypes.VERIFY_EMAIL
    );
    const user = await User.findById(verifyEmailTokenDoc.user);
    if (!user) throw new Error();

    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await User.findByIdAndUpdate(user.id, { isEmailVerified: true });
    const tokens = await token.generateAuthTokens(user);
    successReponse(req, res, { user, ...tokens }, "Email verify successfully");
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
