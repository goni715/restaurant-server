import express, { NextFunction, Request, Response } from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from './user.constant';
import UserController from './user.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createUserValidationSchema, updateProfileValidationSchema } from './user.validation';
import upload from '../../helper/upload';

const router = express.Router();

router.post(
  "/create-user",
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validationMiddleware(createUserValidationSchema),
  UserController.createUser
);
router.get(
  "/get-users",
  AuthMiddleware(UserRole.super_admin, UserRole.administrator),
  UserController.getUsers
);
router.get(
  "/get-single-user/:id",
  AuthMiddleware(UserRole.super_admin, UserRole.owner, UserRole.administrator),
  UserController.getSingleUser
);
router.get(
  "/get-me",
  AuthMiddleware(UserRole.super_admin, UserRole.owner, UserRole.user, UserRole.administrator),
  UserController.getMe
);
router.get(
  "/get-me-for-super-admin",
  AuthMiddleware(UserRole.super_admin,UserRole.administrator),
  UserController.getMeForSuperAdmin
);
router.patch(
  "/edit-my-profile",
  AuthMiddleware(UserRole.super_admin, UserRole.owner, UserRole.user, UserRole.administrator),
  upload.single('file'),
  validationMiddleware(updateProfileValidationSchema),
  UserController.editMyProfile
);

router.patch(
  "/update-profile-img",
  AuthMiddleware(UserRole.super_admin, UserRole.owner, UserRole.user, UserRole.administrator),
  upload.single('file'),
  UserController.updateProfileImg
);

export const UserRoutes = router;
