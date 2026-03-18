import { Request, Response, NextFunction } from "express";

export const validateImage = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({ message: "Invalid file type" });
  }

  next();
};