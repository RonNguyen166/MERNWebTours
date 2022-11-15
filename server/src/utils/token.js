import jwt from "jsonwebtoken";
import moment from "moment";
import config from "../config/config.js";
import Token from "../models/tokenModel.js";
import ApiError from "./ApiError.js";
import tokenTypes from "../config/tokenTypes.js";
import User from "../models/userModel.js";

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires,
    type,
    blacklisted,
  });
  return tokenDoc;
};

const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) throw new ApiError("Token not found");
  return tokenDoc;
};

const generateAuthTokens = async (user, refreshTokenDoc = false) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );
  if (!refreshTokenDoc) {
    const refreshTokenExpires = moment().add(
      config.jwt.refreshExpirationDays,
      "days"
    );
    const refreshToken = generateToken(
      user.id,
      refreshTokenExpires,
      tokenTypes.REFRESH
    );
    await Token.deleteMany({ user: user.id, type: tokenTypes.REFRESH });
    await saveToken(
      refreshToken,
      user.id,
      refreshTokenExpires,
      tokenTypes.REFRESH
    );
    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires,
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires,
      },
    };
  }
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires,
    },
    refresh: {
      token: refreshTokenDoc.token,
      expires: refreshTokenDoc.expires,
    },
  };
};

const generateResetPasswordToken = async (email) => {
  const user = await User.findOne(email);
  if (!user) throw new ApiError("No users found with this email", 404);
  const expires = new Date(
    Date.now() + config.jwt.resetPasswordExpirationMinutes * 60 * 1000
  );
  const reserPasswordToken = genertationToken(
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  await saveToken(
    reserPasswordToken,
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  return reserPasswordToken;
};

const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(config.jwt.accessExpirationMinutes, "minutes");
  const verifyEmailToken = generateToken(
    user.id,
    expires,
    tokenTypes.VERIFY_EMAIL
  );
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

export {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
