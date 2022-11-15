import express from "express";
import * as reviewController from "../controllers/reviewController.js";
import { auth, restrictTo } from "../middlewares/auth.js";

const router = express.Router({ mergeParams: true });

router.use(auth);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(reviewController.createReview);

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(restrictTo("user", "admin"), reviewController.updateReview)
  .delete(restrictTo("user", "admin"), reviewController.deleteReview);

export default router;
