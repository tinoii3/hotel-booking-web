import { Request, Response } from "express";
import { uploadToCloudinary } from "../services/upload.service.js";

export const uploadImage = async (req: Request, res: Response) => {
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