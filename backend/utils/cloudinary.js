import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"



const uploadOnCloudinary = async (localFilePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    if (localFilePath === null) {
        console.log("Local file not exists");
    }
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log(response);
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        console.log("cloudinary error: ", error);
        fs.unlinkSync(localFilePath)
        return null
    }
}

const destroyImage = async (publicId, resource_type = "image") => {
    console.log("destoyImage ", publicId);
    try {
        const response = await cloudinary.uploader.destroy(publicId, {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            resource_type
        })
        console.log("File is deleted on cloudinary", response);
        return response
    } catch (error) {
        console.log(error);
        return null
    }
}
// https://res.cloudinary.com/dkldvlddb/image/upload/v1756198753/derqkulceai8rm2clrkh.png

const getPublicIdFromUrl = (url) => {
    let parts = url.split("/")
    let publicId = parts[parts.length - 1].split(".")[0]
    return publicId
}

export { uploadOnCloudinary, destroyImage, getPublicIdFromUrl }