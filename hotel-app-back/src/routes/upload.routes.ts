import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { uploadImage } from "../controllers/upload.controller.js";
import { validateImage } from "../middlewares/fileValidator.js";

const router = Router();

router.post("/", upload.single("image"), validateImage, uploadImage,);
// router.post("/", upload.array("images", 5), validateImage, uploadImage,);

export default router;