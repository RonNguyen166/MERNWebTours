import express from "express";
import * as categoryController from "../controllers/categoryController";
import { auth, restrictTo } from "../middlewares/auth";
import {
  uploadCategoryImages,
  resizeCategoryImages,
} from "../middlewares/uploadImg";
const router = express.Router();

router.get("/", categoryController.getAllCategorys);

router.use(auth);
router.use(restrictTo("admin", "lead-guide"));

router
  .route("/")
  .post(
    uploadCategoryImages,
    resizeCategoryImages,
    categoryController.createCategory
  );
router
  .route("/:id")
  .get(categoryController.getCategory)
  .patch(
    uploadCategoryImages,
    resizeCategoryImages,
    categoryController.updateCategory
  )
  .delete(categoryController.deleteCategory);

export default router;
