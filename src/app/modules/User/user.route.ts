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



export const UserRoutes = router;
