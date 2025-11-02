import cloudinary from 'cloudinary'
import { configDotenv } from 'dotenv';
import fs from 'fs'

configDotenv()

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async (req, res, next) => {
  try {
    if(!req.file){
      return next();
    }

    const filePath = req.file.path;

    const imgDetails = await cloudinary.v2.uploader.upload(filePath, {
      folder: 'aces-members',
      resource_type: 'image'
    });

    if(fs.existsSync(filePath)){
      fs.unlinkSync(filePath)
    }

    req.body.photoURL = imgDetails.secure_url;

    next();
  } catch (error) {
    return res.status(500).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: "Error uploading image: " + error.message,
      data: null
    });
  }
}