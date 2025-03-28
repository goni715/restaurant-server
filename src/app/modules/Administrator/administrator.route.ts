
import express, { NextFunction, Request, Response } from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import AdministratorController from './administrator.controller';
import { createAdministratorSchema } from './administrator.validation';
import upload from '../../helper/upload';

const router = express.Router();

router.post(
  "/create-administrator",
  AuthMiddleware(UserRole.super_admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validationMiddleware(createAdministratorSchema),
  AdministratorController.createAdministrator
);



export const AdministratorRoutes = router;