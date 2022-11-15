import express from "express";
const router = express.Router();

import * as authController from "../controllers/authController.js";

import { auth } from "../middlewares/auth.js";

/* GET users listing. */
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.post("/refresh-tokens", authController.refreshTokens);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword", authController.resetPassword);
router.post(
  "/send-verification-email",
  auth,
  authController.sendVerificationEmail
);
router.post("/verify-email", authController.verifyEmail);

router.patch("/updateMyPassword", auth, authController.updatePassword);

router.post("/google_login", authController.googleLogin);
router.post("/facebook_login", authController.facebookLogin);

export default router;
