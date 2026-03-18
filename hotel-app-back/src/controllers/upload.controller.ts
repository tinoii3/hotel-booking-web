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
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteSigleImage = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ message: "Public ID is required" });
    }
    const result = await deleteFromCloudinary(publicId);
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
        imageUrl: r.secure_url,
        publicId: r.public_id,
      })),
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteMultipleImages = async (req: Request, res: Response) => {
  try {
    const { publicIds } = req.body;
    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return res.status(400).json({ message: "Public IDs are required" });
    }
    const results = await Promise.all(
      publicIds.map((id: string) => deleteFromCloudinary(id)),
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
