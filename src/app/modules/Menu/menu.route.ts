import express, { NextFunction, Request, Response } from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import MenuController from './menu.controller';
import { createMenuValidationSchema, updateMenuValidationSchema } from './menu.validation';
import upload from '../../helper/upload';

const router = express.Router();

router.post(
  "/create-menu",
  AuthMiddleware(UserRole.owner),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validationMiddleware(createMenuValidationSchema),
  MenuController.createMenu
);

router.get(
  "/get-menus",
  AuthMiddleware(UserRole.owner),
  MenuController.getMenus
);

router.get(
  "/get-menus-by-restaurant-id/:restaurantId",
  AuthMiddleware(UserRole.user),
  MenuController.getMenusByRestaurantId
);

router.patch(
  "/update-menu/:menuId",
  AuthMiddleware(UserRole.owner),
  upload.single('file'),
 validationMiddleware(updateMenuValidationSchema),
  MenuController.updateMenu
);


router.delete(
  "/delete-menu/:menuId",
  AuthMiddleware(UserRole.owner),
  MenuController.deleteMenu
);

export const MenuRoutes = router;