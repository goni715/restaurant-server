
import express, { NextFunction, Request, Response } from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import AdministratorController from './administrator.controller';
import { createAdministratorSchema, updateAdministratorAccessSchema } from './administrator.validation';
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


router.patch(
  "/update-administrator-access/:administratorId",
  AuthMiddleware(UserRole.super_admin),
  validationMiddleware(updateAdministratorAccessSchema),
  AdministratorController.updateAdministrator
);


export const AdministratorRoutes = router;