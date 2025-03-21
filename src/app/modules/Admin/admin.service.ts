import { Request } from "express";
import AppError from "../../errors/AppError";
import { IUser } from "../User/user.interface";
import UserModel from "../User/user.model";


const createAdminService = async (req:Request, payload: IUser) => {
  console.log(payload);
  const user = await UserModel.findOne({ email: payload.email });
  console.log(user);
  if (user) {
    throw new AppError(409, "Email is already existed");
  }

  if (req.file) {
    //for local machine file path
    payload.profileImg = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; //for local machine
 }

  const result = await UserModel.create({
    ...payload,
    role: "admin",
  });

  result.password = "";
  return result;
};
  


export {
    createAdminService
}