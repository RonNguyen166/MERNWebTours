import Tour from "../models/tourModel";
import User from "../models/userModel";
import APIFeatures from "../utils/APIFeatures";
import catchAsync from "../utils/catchAsync";

export const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined! Please use /signup instead",
  });
};

// add user into tour test
export const addGuide = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.guideId);
  if (!user) return next(new ApiError("No guide found with this email.", 404));
  if (req.user.role == "lead-guide") {
    if (!user.role == "guide") return next(new ApiError("Not found", 400));
    await Tour.findByIdAndUpdate(req.params.tourId, {
      $push: { guide: user.id },
    });
  }
  await Tour.findByIdAndUpdate(req.params.tourId, {
    $push: { guide: user.id },
  });

  res.stauts(201).json({
    status: "success",
    data: user,
  });
});

export const deleteGuide = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ApiError("No users found with this ID.", 404));
  if (req.user.role == "lead-guide") {
    if (!user.role == "guide") return next(new ApiError("Invalid email", 400));
    await Tour.findByIdAndUpdate(req.params.tourId, {
      $pull: { guide: user.id },
    });
  }
  await Tour.findByIdAndUpdate(req.params.tourId, {
    $pull: { guide: user.id },
  });

  res.stauts(201).json({
    status: "success",
    data: user,
  });
});

export const getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await features.query;
  res.status(200).json({
    status: "success",
    data: users,
  });
});

export const getUserByID = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ApiError("No users found with this ID.", 404));
  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) return next(new ApiError("No users found with this ID.", 404));

  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new ApiError("No users found with this ID.", 404));
  res.status(200).json({
    status: "success",
    data: null,
  });
});

const filterObj = (obj, ...allowedfields) => {
  const _obj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedfields.includes(el)) _obj[el] = obj[el];
  });
  return _obj;
};

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        "This route is not password updates. Please use /updateMyPassword",
        400
      )
    );
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    user,
  });
});

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
});

export const getUserByEmail = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ApiError("No users found with this email.", 404));

  res.status(200).json({
    status: "success",
    data: user,
  });
});
