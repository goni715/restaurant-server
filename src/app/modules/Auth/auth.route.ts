import express from 'express';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { changePasswordSchema, forgotPassCreateNewPassSchema, forgotPassSendOtpSchema, forgotPassVerifyOtpSchema, loginValidationSchema, } from './auth.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import AuthController from './authController';

const router = express.Router();

router.post('/login', validationMiddleware(loginValidationSchema), AuthController.loginUser);
router.post('/login-super-admin', validationMiddleware(loginValidationSchema), AuthController.loginSuperAdmin);


//forgot-password
router.post('/forgot-pass-send-otp', validationMiddleware(forgotPassSendOtpSchema), AuthController.forgotPassSendOtp);
router.post('/forgot-pass-verify-otp', validationMiddleware(forgotPassVerifyOtpSchema), AuthController.forgotPassVerifyOtp);
router.post('/forgot-pass-create-new-pass', validationMiddleware(forgotPassCreateNewPassSchema), AuthController.forgotPassCreateNewPass);

router.put('/change-password', AuthMiddleware(UserRole.admin, UserRole.super_admin, UserRole.user), validationMiddleware(changePasswordSchema), AuthController.changePassword);




export const AuthRoutes = router;
