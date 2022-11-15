import Category from "../models/categoryModel.js";
import Tour from "../models/tourModel.js";
import ApiError from "../utils/ApiError.js";
import APIFeatures from "../utils/APIFeatures.js";
import catchAsync from "../utils/catchAsync.js";

export const createCategory = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.filename;
  const _category = await Category.create(req.body);
  res.status(201).json({
    status: "success",
    data: _category,
  });
});

export const getAllCategorys = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Category.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const categories = await features.query;
  res.status(200).json({
    status: "success",
    results: categories.length,
    data: categories,
  });
});

export const getCategory = catchAsync(async (req, res, next) => {
  let category = await Category.findById(req.params.id);
  if (!category)
    return next(new ApiError("No categories found with this ID.", 404));
  res.status(200).json({
    status: "success",
    data: category,
  });
});

export const updateCategory = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.filename;
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category)
    return next(new ApiError("No categories found with this ID", 404));
  res.status(200).json({
    status: "success",
    data: category,
  });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  await Tour.findByIdAndUpdate(req.params.tourId, {
    $pull: { categories: category.id },
  });
  if (!category)
    return next(new ApiError("No categories found with this ID.", 404));
  res.status(200).json({
    status: "success",
    data: null,
  });
});
