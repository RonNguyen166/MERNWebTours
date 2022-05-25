import multer from "multer";
import catchAsync from "../utils/catchAsync";
import sharp from "sharp";
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Not an image! Please upload only images.", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
// images Tour
export const uploadTourImages = upload.array("images", 5);

export const resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];
  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(1920, 1120)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`client/public/img/tours/${filename}`);
      req.body.images.push(filename);
    })
  );
  next();
});

// photo User

export const uploadUserPhoto = upload.single("photo");

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`client/public/img/users/${req.file.filename}`);
  next();
});

export const uploadCategoryImages = upload.single("image");

export const resizeCategoryImages = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `category-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`client/public/img/categories/${req.file.filename}`);
  next();
});
