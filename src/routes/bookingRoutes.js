import express from "express";
import * as bookingController from "../controllers/bookingController";
import { auth, restrictTo } from "../middlewares/auth";

const router = express.Router();

router.use(auth);

router.get("/myTours", bookingController.getMyTours);

router.route("/checkout-session/:tourId", bookingController.getCheckoutSession);

router.use(restrictTo("admin", "lead-guide"));

router
  .route("/")
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route("/:id")
  .get(bookingController.getBookingById)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

export default router;
