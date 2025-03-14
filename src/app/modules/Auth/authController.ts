import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { changePasswordService, forgotPassCreateNewPassService, forgotPassSendOtpService, forgotPassVerifyOtpService, loginSuperAdminService, loginUserService } from "./auth.service";



const loginUser = catchAsync(async (req, res) => {
 const result = await loginUserService(req.body);
 const { accessToken, refreshToken} = result;
 
 res.cookie("refreshToken", refreshToken, {
   httpOnly: true,  // Prevents client-side access to the cookie (more secure)
   secure: config.node_env === "production", // Only use HTTPS in production
   maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 day
   sameSite: "strict", // Prevents CSRF attacks
 });

 sendResponse(res, {
   statusCode: 200,
   success: true,
   message: "User is logged in successfully",
   data: {
     accessToken
   }
 })
})


const loginSuperAdmin = catchAsync(async (req, res) => {
  const result = await loginSuperAdminService(req.body);
  const { accessToken, refreshToken} = result;
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,  // Prevents client-side access to the cookie (more secure)
    secure: config.node_env === "production", // Only use HTTPS in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 day
    sameSite: "strict", // Prevents CSRF attacks
  });
 
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Super Admin is logged in successfully",
    data: {
      accessToken
    }
  })
 })

//forgot-password
//step-01
const forgotPassSendOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await forgotPassSendOtpService(email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Otp is sent to your email address successfully",
    data: result
  })
});


//step-02
const forgotPassVerifyOtp = catchAsync(async (req, res) => {
    const result = await forgotPassVerifyOtpService(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Otp is verified successfully",
      data: result
    })
 });


 //step-03
const forgotPassCreateNewPass = catchAsync(async (req, res) => {
  const result = await forgotPassCreateNewPassService(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password is reset successfully",
    data: result
  })
});



const changePassword = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await changePasswordService(loginUserId as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password is updated successfully",
    data: result
  })
});





 const AuthController = {
  loginUser,
  loginSuperAdmin,
  forgotPassSendOtp,
  forgotPassVerifyOtp,
  forgotPassCreateNewPass,
  changePassword
}

export default AuthController;
 