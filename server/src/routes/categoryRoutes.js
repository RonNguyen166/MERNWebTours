import express from "express";
import * as categoryController from "../controllers/categoryController.js";
import { auth, restrictTo } from "../middlewares/auth.js";
import {
  uploadCategoryImages,
  resizeCategoryImages,
} from "../middlewares/uploadImg.js";
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
