import { v2 as cloudinary } from 'cloudinary';

export async function uploadImage(imagePath, imageId) {

  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    public_id: imageId,
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    return result.secure_url;
  } catch (error) {
    console.error(error);
  }
}
