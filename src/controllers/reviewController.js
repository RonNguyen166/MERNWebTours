import Review from "../models/reivewModel";
import Tour from "../models/tourModel";
import ApiError from "../utils/ApiError";
import APIFeatures from "../utils/APIFeatures";
import catchAsync from "../utils/catchAsync";

export const createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const _review = await Review.create(req.body);
  await Tour.findByIdAndUpdate(req.body.tour, {
    $push: { reviews: _review.id },
  });
  res.status(201).json({
    status: "success",
    data: _review,
  });
});

export const getAllReviews = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Review.find({ tour: req.params.tourId }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const reviews = await features.obj;
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: reviews,
  });
});

export const getReview = catchAsync(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) return next(new ApiError("No reviews found with this ID.", 404));
  res.status(200).json({
    status: "success",
    data: review,
  });
});

export const updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!review) return next(new ApiError("No reviews found with this ID", 404));
  res.status(200).json({
    status: "success",
    data: review,
  });
});

export const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  console.log(review);
  await Tour.findByIdAndUpdate(req.params.tourId, {
    $pull: { reviews: review.id },
  });
  if (!review) return next(new ApiError("No reviews found with this ID.", 404));
  res.status(204).json({
    status: "success",
    data: null,
  });
});
