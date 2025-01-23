import { env } from "@/utils/env";
import { v2 as cloudinary } from "cloudinary";

class Cloudinary {
  private cloudinary: typeof cloudinary;

  constructor() {
    this.cloudinary = cloudinary;
    cloudinary.config({
      cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret: env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
    });
  }

  async upload(filePath: string) {
    try {
      const result = await this.cloudinary.uploader.upload(filePath, {
        folder: "ukuphi",
        use_filename: false,
        unique_filename: true,
      });

      return result.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary", error);
      return;
    }
  }
}

export const cloudinaryService = new Cloudinary();
