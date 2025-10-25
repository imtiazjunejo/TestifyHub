// src/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Optional: verify envs at startup
console.log("CLOUDINARY ENV CHECK:", {
  CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  const absPath = path.isAbsolute(localFilePath)
    ? localFilePath
    : path.resolve(process.cwd(), localFilePath);

  try {
    const response = await cloudinary.uploader.upload(absPath, {
      folder: "avatars",
      resource_type: "image",
    });

    try {
      fs.unlinkSync(absPath);
    } catch {}

    console.log("file uploaded to cloudinary:", response.secure_url || response.url);
    return response;
  } catch (error) {
    try {
      fs.unlinkSync(absPath);
    } catch {}

    console.error("Cloudinary upload error:", {
      message: error?.message,
      http_code: error?.http_code,
      name: error?.name,
      response: error?.response?.body || error?.response,
    });
    return null;
  }
};
