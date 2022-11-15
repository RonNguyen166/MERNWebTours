import express from "express";
import * as tourController from "../controllers/tourController.js";
import * as reviewController from "../controllers/reviewController.js";
import reviewRouter from "./reviewRoutes.js";
import { auth, restrictTo } from "../middlewares/auth.js";
import {
  resizeTourImages,
  uploadTourImages,
} from "../middlewares/uploadImg.js";
const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);

router
  .route("/tour-4-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);

router
  .route("/monthly-plan/:year")
  .get(
    auth,
    restrictTo("admin", "lead-guide", "guide"),
    tourController.getMonthlyPlan
  );

router
  .route("/")
  .get(tourController.getAllTours)
  .post(auth, restrictTo("admin", "lead-guide"), tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTourById)
  .patch(
    auth,
    restrictTo("admin", "lead-guide"),
    uploadTourImages,
    resizeTourImages,
    tourController.updateTour
  )
  .delete(auth, restrictTo("admin", "lead-guide"), tourController.deleteTour);

export default router;
