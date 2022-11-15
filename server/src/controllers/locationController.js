import { successReponse } from "../common/responseService.js";
import * as locationService from "../service/locationSerivce.js";
import catchAsync from "../utils/catchAsync.js";

export const create = catchAsync(async (req, res, next) => {
  const data = req.body;
  const locaion = await locationService.create(data);
  return successReponse(req, res, locaion, "Created successfully!", 201);
});

export const getAll = catchAsync(async (req, res, next) => {
  const query = req.query;
  const locaions = await locationService.getLocations(query);
  return successReponse(req, res, locaions, "Get Successfully! ");
});

export const getOne = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const locaion = await locationService.getLocationById(id);
  return successReponse(req, res, locaion, "Get Successfully!");
});

export const update = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const locaion = await locationService.updateLocation(id, data);
  return successReponse(req, res, locaion, "Updated successfully!");
});

export const remove = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const locaion = await locationService.deleteLocation(id);
  return successReponse(req, res, locaion, "Deleted successfully!");
});
