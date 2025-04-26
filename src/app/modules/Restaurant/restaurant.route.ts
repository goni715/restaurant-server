import express, { NextFunction, Request, Response } from 'express';
import validationMiddleware from '../../middlewares/validationMiddleware';
import RestaurantController from './restaurant.controller';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import { approveRestaurantSchema, changeRestaurantStatusSchema, createRestaurantValidationSchema, updateRestaurantValidationSchema, } from './restaurant.validation';
import upload from '../../helper/upload';
import isAccess from '../../middlewares/isAccess';

const router = express.Router();

router.post(
  "/create-restaurant",
  AuthMiddleware(UserRole.owner),
  upload.single('file'),
  // (req: Request, res: Response, next: NextFunction) => {
  //   req.body = JSON.parse(req.body.data);
  //   next();
  // },
  validationMiddleware(createRestaurantValidationSchema),
  RestaurantController.createRestaurant
);


router.get(
  "/get-restaurants",
  AuthMiddleware("super_admin", "administrator"),
  RestaurantController.getRestaurants
);
router.get(
  "/get-single-restaurant/:restaurantId",
  AuthMiddleware("super_admin", "administrator", "user"),
  RestaurantController.getSingleRestaurant
);
router.get(
  "/get-user-restaurants",
  AuthMiddleware(UserRole.user),
  RestaurantController.getUserRestaurants
);
router.get(
  "/get-owner-restaurants",
  AuthMiddleware(UserRole.owner),
  RestaurantController.getOwnerRestaurant
);

router.patch(
  "/change-restaurant-status/:restaurantId",
  AuthMiddleware(UserRole.super_admin, UserRole.administrator),
  isAccess("restaurant"),
  validationMiddleware(changeRestaurantStatusSchema),
  RestaurantController.changeRestaurantStatus
);

router.patch(
  "/approve-restaurant/:restaurantId",
  AuthMiddleware(UserRole.super_admin, UserRole.administrator),
  isAccess("restaurant"),
  validationMiddleware(approveRestaurantSchema),
  RestaurantController.approveRestaurant
);

router.patch(
  "/update-restaurant",
  AuthMiddleware(UserRole.owner),
  validationMiddleware(updateRestaurantValidationSchema),
  RestaurantController.updateRestaurant
);

router.delete(
  "/delete-restaurant",
  AuthMiddleware(UserRole.owner),
  RestaurantController.deleteRestaurant
);




export const RestaurantRoutes = router;
