import Category from "../models/categoryModel";
import Tour from "../models/tourModel";
import ApiError from "../utils/ApiError";
import APIFeatures from "../utils/APIFeatures";
import catchAsync from "../utils/catchAsync";

export const createCategory = catchAsync(async (req, res, next) => {
  const _category = await Category.create(req.body);
  res.status(201).json({
    status: "success",
    data: _category,
  });
});

export const getAllCategorys = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Category.find({ tour: req.params.tourId }))
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const categories = await features.obj;
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
  res.status(204).json({
    status: "success",
    data: null,
  });
});
