import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { uploadSingleImage, uploadMultipleImages, deleteSigleImage, deleteMultipleImages } from "../controllers/upload.controller.js";
import { validateImage } from "../middlewares/fileValidator.js";

const router = Router();

router.post(
  "/single",
  upload.single("image"),
  validateImage,
  uploadSingleImage
);

router.post(
  "/multiple",
  upload.array("images", 5),
  uploadMultipleImages
);

router.delete(
  "/delete-single",
  upload.single("image"),
  deleteSigleImage
);

router.delete(
  "/delete-multiple",
  upload.array("images", 5),
  deleteMultipleImages
);

export default router;