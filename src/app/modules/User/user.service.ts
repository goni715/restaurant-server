import UserModel from "./user.model";
import { IUser, TUserQuery } from "./user.interface";
import AppError from "../../errors/AppError";
import { Request } from "express";



const createUserService = async (req:Request, payload: IUser) => {
  const user = await UserModel.findOne({ email: payload.email });
  if (user) {
      throw new AppError(409, 'Email is already existed')
  }
        

  if (req.file) {
     //for local machine file path
     payload.profileImg = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; //for local machine
  }


  const result = await UserModel.create({
    ...payload,
    role: "user"
  });

  result.password=""
  return result;
}



const getSuggestedUsersService = async (loginUserId: string, query: TUserQuery) => {
  return null;
}



export { createUserService, getSuggestedUsersService };
