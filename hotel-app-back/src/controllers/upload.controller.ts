import { Request, Response } from "express";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../services/upload.service.js";

export const uploadSingleImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    return res.json({
      image_url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteSigleImage = async (req: Request, res: Response) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ message: "Public ID is required" });
    }
    const result = await deleteFromCloudinary(public_id);
    if (result.result !== "ok") {
      return res.status(500).json({ message: "Failed to delete image" });
    }
    return res.json({ message: "Image deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadMultipleImages = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    for (const file of files) {
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Invalid file type" });
      }
    }

    const results = await Promise.all(
      files.map((file) => uploadToCloudinary(file.buffer)),
    );

    return res.json({
      images: results.map((r) => ({
        image_url: r.secure_url,
        public_id: r.public_id,
      })),
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteMultipleImages = async (req: Request, res: Response) => {
  try {
    const { public_id } = req.body;
    if (!public_id || !Array.isArray(public_id) || public_id.length === 0) {
      return res.status(400).json({ message: "Public IDs are required" });
    }
    const results = await Promise.all(
      public_id.map((id: string) => deleteFromCloudinary(id)),
    );
    const failedDeletions = results.filter((r) => r.result !== "ok");
    if (failedDeletions.length > 0) {
      return res
        .status(500)
        .json({
          message: "Failed to delete some images",
          details: failedDeletions,
        });
    }
    return res.json({ message: "Images deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
