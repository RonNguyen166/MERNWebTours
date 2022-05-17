import express from "express";
import { auth, restrictTo, isLoggedIn } from "../middlewares/auth";
import * as userController from "../controllers/userController";
import * as authController from "../controllers/authController";
import { uploadUserPhoto, resizeUserPhoto } from "../middlewares/uploadImg";

const router = express.Router();

// router.use(auth);
router.patch("/updateMyPassword", authController.updatePassword);

router.get("/me", userController.getMe, userController.getUserByID);
router.patch(
  "/updateMe",
  uploadUserPhoto,
  resizeUserPhoto,
  userController.updateMe
);
router.delete("/deleteMe", userController.deleteMe);

router.use(auth, restrictTo("admin"));
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUserByID)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
