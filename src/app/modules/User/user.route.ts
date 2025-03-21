import express, { NextFunction, Request, Response } from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from './user.constant';
import UserController from './user.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createUserValidationSchema } from './user.validation';
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
  AuthMiddleware(UserRole.super_admin, UserRole.admin),
  UserController.getUsers
);
router.get(
  "/get-single-user/:id",
  AuthMiddleware(UserRole.super_admin, UserRole.admin),
  UserController.getSingleUser
);
router.get(
  "/get-me",
  AuthMiddleware(UserRole.super_admin, UserRole.admin, UserRole.user),
  UserController.getMe
);
router.put(
  "/edit-my-profile",
  AuthMiddleware(UserRole.super_admin, UserRole.admin, UserRole.user),
  UserController.editMyProfile
);

router.put(
  "/update-profile-img",
  AuthMiddleware(UserRole.super_admin, UserRole.admin, UserRole.user),
  upload.single('file'),
  UserController.updateProfileImg
);

export const UserRoutes = router;
