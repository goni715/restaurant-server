import { Request } from "express";

const uploadImage = async (req: Request) => {
  const path = `${req.protocol}://${req.get("host")}/uploads/${req?.file?.filename}`;  //for local machine
  return path;
};

export default uploadImage;