import express from "express";
import * as locationController from "../controllers/locationController.js";
const router = express.Router();

router
  .route("/")
  .get(locationController.getAll)
  .post(locationController.create);
router
  .route("/:id")
  .get(locationController.getOne)
  .patch(locationController.update)
  .delete(locationController.remove);

export default router;
