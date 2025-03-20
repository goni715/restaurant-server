import express, { NextFunction, Request, Response } from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import MenuController from './menu.controller';
import { createMenuValidationSchema } from './menu.validation';
import upload from '../../helper/upload';

const router = express.Router();

router.post(
  "/create-menu",
  AuthMiddleware(UserRole.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validationMiddleware(createMenuValidationSchema),
  MenuController.createMenu
);
router.get(
  "/get-menus/:restaurantId",
  AuthMiddleware(UserRole.admin, UserRole.user),
  MenuController.getMenus
);



export const MenuRoutes = router;