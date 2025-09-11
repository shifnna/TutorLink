// config/utils/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  fileName: string,
  folder: string
) => {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: fileName.split(".")[0],
        resource_type: "auto", // handles images, pdf, docs, etc.
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url || "");
      }
    );

    stream.end(fileBuffer);
  });
};
