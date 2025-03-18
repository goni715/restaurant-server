import { Secret } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import checkPassword from "../../utils/checkPassword";
import UserModel from "../User/user.model";
import { IChangePass, ILoginUser, INewPassword, IVerifyOTp } from "./auth.interface";
import createToken, { TExpiresIn } from "../../utils/createToken";
import config from "../../config";
import OtpModel from "./otp.model";
import sendEmailUtility from "../../utils/sendEmailUtility";
import hashedPassword from "../../utils/hashedPassword";
import mongoose, { Types } from "mongoose";
import RestaurantModel from "../Restaurant/restaurant.model";




const loginUserService = async (payload: ILoginUser) => {
    const user = await UserModel.findOne({ email: payload.email }).select('+password');
    if (!user) {
        throw new AppError(404, `Couldn't find this email address`);
    }

    //check password
    const isPasswordMatch = await checkPassword(payload.password, user.password);
    if (!isPasswordMatch) {
        throw new AppError(400, 'Password is not correct');
    }




    //create accessToken
    const accessToken = createToken({ email: user.email, id: String(user._id), role: user.role }, config.jwt_access_secret as Secret, config.jwt_access_expires_in as TExpiresIn);
    //create refreshToken
    const refreshToken = createToken({ email: user.email, id: String(user._id), role: user.role }, config.jwt_refresh_secret as Secret, config.jwt_refresh_expires_in as TExpiresIn);

    return {
        accessToken,
        refreshToken
    }
}


const loginSuperAdminService = async (payload: ILoginUser) => {
  const user = await UserModel.findOne({ email: payload.email }).select('+password');
  if (!user) {
      throw new AppError(404, `Couldn't find this email address`);
  }

  //check you are not admin
  if(user.role !=="super_admin"){
    throw new AppError(400, `Sorry! You are not Super admin`);
  }

  //check password
  const isPasswordMatch = await checkPassword(payload.password, user.password);
  if (!isPasswordMatch) {
      throw new AppError(400, 'Password is not correct');
  }



  //create accessToken
  const accessToken = createToken({ email: user.email, id: String(user._id), role: user.role}, config.jwt_access_secret as Secret, config.jwt_access_expires_in as TExpiresIn);
  //create refreshToken
  const refreshToken = createToken({ email: user.email, id: String(user._id), role: user.role }, config.jwt_refresh_secret as Secret, config.jwt_refresh_expires_in as TExpiresIn);

  return {
      accessToken,
      refreshToken
  }
}


//forgot password
// step-01
const forgotPassSendOtpService = async (email: string) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new AppError(404, `Couldn't find this email address`);
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    //insert the otp
    await OtpModel.create({ email, otp });


    //send otp to the email address
    await sendEmailUtility(email, String(otp))

    return null;

}


//step-02
const forgotPassVerifyOtpService = async (payload: IVerifyOTp) => {
  const { email, otp } = payload;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError(404, `Couldn't find this email address`);
  }

  //check otp doesn't exist
  const otpExist = await OtpModel.findOne({ email, otp, status: 0 });
  if (!otpExist) {
    throw new AppError(400, "Invalid Otp Code");
  }

  //check otp is expired
  const otpExpired = await OtpModel.findOne({
    email,
    otp,
    status: 0,
    otpExpires: { $gt: new Date(Date.now()) },
  });

  if(!otpExpired) {
    throw new AppError(400, "This Otp is expired");
  }


   //update the otp status
   await OtpModel.updateOne(
    { email, otp, status:0 },
    { status: 1 }
   );

  return null;
};



//step-03
const forgotPassCreateNewPassService = async (payload: INewPassword) => {
  const { email, otp, password} = payload;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError(404, `Couldn't find this email address`);
  }

      //check otp exist
      const OtpExist = await OtpModel.findOne({ email, otp, status: 1 });
      if (!OtpExist) {
        throw new AppError(404, `Invalid Otp Code`);
      }
  
  
      
      //Database Third Process
      //check otp is expired
      const OtpExpired = await OtpModel.findOne({
          email,
          otp,
          status:1,
          otpExpires: { $gt: new Date(Date.now()) },
        });
  
  
        if (!OtpExpired) {
          throw new AppError(404, `This Otp Code is expired`);
        }

         //update the password
        const hashPass = await hashedPassword(password);//hashedPassword
        const result = await UserModel.updateOne({email: email},{password: hashPass, passwordChangedAt: new Date()})

      return result;
}


const changePasswordService = async (loginUserId: string, payload: IChangePass) => {
  const { currentPassword, newPassword } = payload;
  const ObjectId = Types.ObjectId;

  const user = await UserModel.findById(loginUserId).select('+password');

  //checking if the password is not correct
  const isPasswordMatched = await checkPassword(
    currentPassword,
    user?.password as string
  ); 

  if(!isPasswordMatched){
    throw new AppError(400, 'Current Password is not correct');
  }

   //hash the newPassword
   const hashPass = await hashedPassword(newPassword);

   //update the password
   const result = await UserModel.updateOne(
     { _id: new ObjectId(loginUserId) },
     { password: hashPass, passwordChangedAt: new Date() }
   );
   
   return result;

}


const changeStatusService = async (id: string, payload: { status: string }) => {
  const ObjectId = Types.ObjectId;

  const user = await UserModel.findById(id);
  if(!user){
    throw new AppError(404, "User Not Found");
  }

  console.log(user);

   const result = await UserModel.updateOne(
    {_id: new ObjectId(id)},
    payload
   );

   return result;
}


const deleteMyAccountService = async (loginUserId: string, password: string) => {
  const ObjectId = Types.ObjectId;
  const user = await UserModel.findById(loginUserId).select('+password');
  if(!user){
    throw new AppError(404, "User Not Found");
  }

   //check password
   const isPasswordMatch = await checkPassword(password, user.password);
   if (!isPasswordMatch) {
       throw new AppError(400, 'Password is not correct');
   }

  //transaction & rollback
 const session = await mongoose.startSession();

  try{
    session.startTransaction();

    //delete restaurant
    await RestaurantModel.deleteOne({ ownerId: new ObjectId(loginUserId) })

     //delete user
     const result = await UserModel.deleteOne({ _id: new ObjectId(loginUserId) })
     await session.commitTransaction();
     await session.endSession();
     return result;
  }
  catch(err:any){
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err)
  }
}

export {
    loginUserService,
    loginSuperAdminService,
    forgotPassSendOtpService,
    forgotPassVerifyOtpService,
    forgotPassCreateNewPassService,
    changePasswordService,
    changeStatusService,
    deleteMyAccountService
}