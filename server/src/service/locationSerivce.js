import httpStatus from "http-status";
import Location from "../models/locationModel.js";
import ApiError from "../utils/ApiError.js";
import APIFeatures from "../utils/APIFeatures.js";

export const create = async (data) => {
  try {
    const locaion = await Location.create(data);
    return locaion;
  } catch (error) {
    throw new ApiError("Location create failed!", httpStatus.BAD_REQUEST);
  }
};
export const getLocations = async (query) => {
  try {
    const feature = new APIFeatures(Location.find(), query);
    const locaions = feature.query;
    const totalRows = Location.countDocuments();
    return {
      totalRows,
      data: locaions,
    };
  } catch (error) {
    throw new ApiError("Get locations failed!", httpStatus.BAD_REQUEST);
  }
};

export const getLocationById = async (id) => {
  const location = await Location.findById(id);
  if (!location)
    throw new ApiError("Get location failed!", httpStatus.BAD_REQUEST);
  return location;
};

export const updateLocation = async (id, body) => {
  const locaion = await getLocationById(id);
  try {
    const editData = Object.assign(locaion, body);
    const updatedLocation = await locaion.save();
    return updateLocation;
  } catch (error) {
    throw new ApiError("Location update failed!", httpStatus.BAD_REQUEST);
  }
};

export const deleteLocation = async (id) => {
  const locaion = await getLocationById(id);

  try {
    const deletedLocaion = await locaion.delete();
    return deletedLocaion;
  } catch (error) {
    throw new ApiError("Location delete failed!", httpStatus.BAD_REQUEST);
  }
};
