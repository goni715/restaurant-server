import { Request } from "express";
import AppError from "../errors/AppError";
import config from "../config";
import s3 from "../helper/s3";

const uploadImage = async (req: Request) => {
  // const path = `${req.protocol}://${req.get("host")}/uploads/${req?.file?.filename}`;  //for local machine
  // return path;
  try {
    if (!req.file) {
      throw new AppError(400, "Please upload a file");
    }


    const params = {
      Bucket: config.aws_s3_bucket_name as string,
      Key: `${Date.now()}-${req.file.originalname}`, // Unique key for the S3 object
      Body: req.file.buffer, // The file content as a Buffer
      ContentType: req.file.mimetype, // Set the correct content type
      //ACL: 'public-read', // Optional: Make the object publicly readable
    };
  
   const data = await s3.upload(params).promise();
    return data?.Location;
  } catch (err:any) {
    throw new Error(err);
  }
};

export default uploadImage;
