import httpStatus from "http-status";
import Banner from "../models/bannerModel.js";
import ApiError from "../utils/ApiError.js";
import APIFeatures from "../utils/APIFeatures.js";

export const create = async (data) => {
  try {
    const banner = await Banner.create(data);
    return banner;
  } catch (error) {
    console.log(error);
    throw new ApiError("Banner create faild!", httpStatus.BAD_REQUEST);
  }
};

export const getBanners = async (query) => {
  const feature = new APIFeatures(Banner.find(), query);
  const banners = feature.query;
  const totalRows = Banner.countDocuments();

  return {
    totalRows,
    data: banners,
  };
};

export const getBanerById = async (id) => {
  const banner = await Banner.findById(id);
  if (!banner) {
    throw new ApiError("Banner not found!", httpStatus.NOT_FOUND);
  }
  return banner;
};

export const updateBanner = async (id, data) => {
  try {
    const banner = await getBanerById(id);
    const editBanner = Object.assign(banner, data);
    const updatedBanner = await editBanner.save();
    return updateBanner;
  } catch (error) {
    throw new ApiError("Banner update failed", httpStatus.BAD_REQUEST);
  }
};
export const deleteBanner = async (id) => {
  try {
    const banner = await getBanerById(id);
    return banner.delete();
  } catch (error) {
    throw new ApiError("Banner delete failed", httpStatus.BAD_REQUEST);
  }
};
