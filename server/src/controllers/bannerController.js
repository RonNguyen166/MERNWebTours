import { successReponse } from "../common/responseService.js";
import * as bannerService from "../service/bannerService.js";
import catchAsync from "../utils/catchAsync.js";

export const create = catchAsync(async (req, res) => {
  const data = req.body;
  const banner = await bannerService.create(data);
  return successReponse(req, res, banner, "Created successfully!", 201);
});

export const getAll = catchAsync(async (req, res) => {
  const { limit = 0, page = 1 } = req.query;
  const banners = await bannerService.getBanners(req.query);
  return successReponse(
    req,
    res,
    { ...banners, limit, page },
    "Get Successful!"
  );
});

export const getById = catchAsync(async (req, res) => {
  const id = req.param.id;
  const banner = await bannerService.getBanerById(id);
  return successReponse(req, res, banner, "Get Successful!");
});

export const updateOne = catchAsync(async (req, res) => {
  const id = req.param.id;
  const data = req.body;
  const banner = await bannerService.updateBanner(id, data);
  return successReponse(req, res, banner, "Update Successful!");
});

export const deleteOne = catchAsync(async (req, res) => {
  const id = req.param.id;
  const banner = await bannerService.deleteBanner(id);
  return successReponse(req, res, banner, "Delele Successful!");
});
