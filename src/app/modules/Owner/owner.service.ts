import { Request } from "express";
import AppError from "../../errors/AppError";
import { IUser } from "../User/user.interface";
import UserModel from "../User/user.model";
import uploadImage from "../../utils/uploadImage";


const createOwnerService = async (req:Request, payload: IUser) => {
  const user = await UserModel.findOne({ email: payload.email });
  if (user) {
    throw new AppError(409, "Email is already existed");
  }

  if (req.file) {
    payload.profileImg = await uploadImage(req);
 }

  const result = await UserModel.create({
    ...payload,
    role: "owner",
  });

  result.password = "";
  return result;
};
  


export {
    createOwnerService
}