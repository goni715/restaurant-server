import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { changePasswordService, changeStatusService, deleteMyAccountService, forgotPassCreateNewPassService, forgotPassSendOtpService, forgotPassVerifyOtpService,  loginOwnerService,  loginSuperAdminService, loginUserService, refreshTokenService, socialLoginService } from "./auth.service";



const loginUser = catchAsync(async (req, res) => {
 const result = await loginUserService(req.body);
 const { role, accessToken, refreshToken} = result;
 
 res.cookie("refreshToken", refreshToken, {
   httpOnly: true,  // Prevents client-side access to the cookie (more secure)
   secure: config.node_env === "production", // Only use HTTPS in production
   maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 day
   sameSite: "strict", // Prevents CSRF attacks
 });

 sendResponse(res, {
   statusCode: 200,
   success: true,
   message: "Login Success",
   data: {
     role,
     accessToken,
     refreshToken
   }
 })
})


const loginOwner = catchAsync(async (req, res) => {
  const result = await loginOwnerService(req.body);
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
    message: "Owner is logged in successfully",
    data: {
      accessToken
    }
  })
 })


const loginSuperAdmin = catchAsync(async (req, res) => {
  const result = await loginSuperAdminService(req.body);
  const { accessToken, refreshToken, message} = result;
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,  // Prevents client-side access to the cookie (more secure)
    secure: config.node_env === "production", // Only use HTTPS in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 day
    sameSite: "strict", // Prevents CSRF attacks
  });
 
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: message,
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



const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await changeStatusService(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User status is changed successfully",
    data: result
  })
});



const deleteMyAccount = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { password } = req.body
  const result = await deleteMyAccountService(loginUserId as string, password);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My account is deleted successfully",
    data: result
  })
});



const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  
  const result = await refreshTokenService(refreshToken);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Access token is retrieved successfully !',
    data: result
  });
});



const socialLogin = catchAsync(async (req, res) => {
  const result = await socialLoginService(req.body);
  //const { role, accessToken, refreshToken} = result;
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,  
    secure: config.node_env === "production", 
    maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 day
    sameSite: "strict", // Prevents CSRF attacks
  });
 
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User is logged in successfully",
    // data: {
    //   "role",
    //   "accessToken",
    //   "refreshToken"
    // }
    data: result
  })
 })
 

 const AuthController = {
  loginUser,
  loginOwner,
  loginSuperAdmin,
  forgotPassSendOtp,
  forgotPassVerifyOtp,
  forgotPassCreateNewPass,
  changePassword,
  changeStatus,
  deleteMyAccount,
  refreshToken,
  socialLogin
}

export default AuthController;
 