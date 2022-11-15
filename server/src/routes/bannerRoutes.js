import express from "express";
import * as bannerController from "../controllers/bannerController.js";
const router = express.Router();

router.route("/").get(bannerController.getAll).post(bannerController.create);

router
  .route("/:id")
  .get(bannerController.getById)
  .patch(bannerController.updateOne)
  .delete(bannerController.deleteOne);

export default router;
