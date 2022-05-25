import Stripe from "stripe";
import config from "../config/config";
import Tour from "../models/tourModel";
import Booking from "../models/bookingModel";
import catchAsync from "../utils/catchAsync";
import APIFeatures from "../utils/APIFeatures";
import ApiError from "../utils/ApiError";
const stripe = new Stripe(config.stripe.secretKey);

const getAllBookings = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Booking.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const bookings = features.query;

  res.status(200).json({
    status: "success",
    results: bookings.lenght,
    data: bookings,
  });
});

const getBookingById = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return next(new ApiError("No booking found with this ID."));
  res.status(200).json({
    status: "success",
    data: booking,
  });
});

const createBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.create(req.body);
  res.status(200).json({
    status: "success",
    data: booking,
  });
});

const updateBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!booking) return next(new ApiError("No booking found with that ID", 404));
  res.status(200).json({
    status: "success",
    data: booking,
  });
});

const deleteBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) return next(new ApiError("No booking found with that ID", 404));
  res.status(204).json({
    status: "success",
    data: null,
  });
});

const getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/?tour=${
      req.params.tourId
    }&user=${req.use.id}%price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`/img/tours/${tour.images[1]}`],
        amount: tour.price * 100,
        currency: "vnd",
        quantity: 1,
      },
    ],
    mode: "payment",
  });
  res.status(200).json({
    status: "success",
    session,
  });
});

const createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour || !user || !price) return next();
  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split("?")[0]);
});

const webhookCheckout = (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  const event = stripe.webhooks.constructEvent(req.body, signature);
};

const getMyTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.aggregate([
    {
      $lookup: {
        from: "Booking",
        localField: "_id",
        foreignField: "tour",
        as: "booking",
      },
    },
    {
      $match: {
        "booking.user": `${req.user.id}`,
      },
    },
    {
      $project: { booking: 0 },
    },
  ]);
  if (!tours)
    return next(new ApiError("The user has not booked any travel yet", 401));
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: tours,
  });
});

export {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getCheckoutSession,
  createBookingCheckout,
  webhookCheckout,
  getMyTours,
};
