import cloudinary from "../configs/cloudinary.js";

export const uploadToCloudinary = (fileBuffer: Buffer) => {
  return new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "hotel/rooms",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(fileBuffer);
  });
};