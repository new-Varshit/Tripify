import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer, folderName = "Tripify") => {
    
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export default uploadToCloudinary;
