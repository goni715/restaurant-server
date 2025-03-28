import { Request } from "express";
import AppError from "../../errors/AppError";
import UserModel from "../User/user.model";
import { IAdministratorPayload } from "./administrator.interface";
import mongoose from "mongoose";
import AdministratorModel from "./administrator.model";
import config from "../../config";


const createAdministratorService = async (req:Request, payload:IAdministratorPayload) => {
    const { administratorData, access } = payload;
    const user = await UserModel.findOne({ email: administratorData.email });
    if (user) {
        throw new AppError(409, 'Email is already existed')
    }

    if(!administratorData.password){
        administratorData.password=config.default_password as string;
    }
 
   const session = await mongoose.startSession();
   
   try{

    session.startTransaction();

    if(req.file){
        //for local machine file path
        administratorData.profileImg = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; //for local machine
    }

    const newUser = await UserModel.create(
      [
        {
          ...administratorData,
          role: "administrator",
        },
      ],
      { session }
    );

    //create the administrator
    await AdministratorModel.create([
      {
        userId: newUser[0]._id,
        access
      },
    ], { session });


    //transaction success
    await session.commitTransaction();
    await session.endSession();
    newUser[0].password=""
    return newUser[0];
   }
   catch(err:any){
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err)
   }   
}

export {
    createAdministratorService
}