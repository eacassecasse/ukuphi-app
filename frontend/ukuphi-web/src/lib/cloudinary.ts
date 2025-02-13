import { Cloudinary } from "cloudinary-core";

class CloudinaryService {
  private cloudinary;

  constructor() {
    // this.cloudinary = cloudinary;
    // cloudinary.config({
    //   cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    //   api_key: env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    //   api_secret: env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
    // });
    this.cloudinary = new Cloudinary({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    })
  }

  async upload(file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ukuphi-app");

      // const result = await this.cloudinary.uploader.upload(filePath, {
      //   folder: "ukuphi",
      //   use_filename: true,
      //   unique_filename: false,
      // });

      // return result.secure_url;

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Upload failed: No URL returned from Cloudinary");
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary", error);
      return;
    }
  }
}

export const cloudinaryService = new CloudinaryService();
