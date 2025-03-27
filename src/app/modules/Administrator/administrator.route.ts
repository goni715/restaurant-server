
import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import AdministratorController from './administrator.controller';

const router = express.Router();

router.post(
  "/create-administrator",
  AuthMiddleware(UserRole.super_admin),
  AdministratorController.createAdministrator
);



export const AdministratorRoutes = router;