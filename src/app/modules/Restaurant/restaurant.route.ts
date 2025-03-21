import express, { NextFunction, Request, Response } from 'express';
import validationMiddleware from '../../middlewares/validationMiddleware';
import RestaurantController from './restaurant.controller';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import { approveRestaurantSchema, changeRestaurantStatusSchema, createRestaurantValidationSchema, updateRestaurantValidationSchema, } from './restaurant.validation';
import upload from '../../helper/upload';

const router = express.Router();

router.post(
  "/create-restaurant",
  AuthMiddleware(UserRole.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validationMiddleware(createRestaurantValidationSchema),
  RestaurantController.createRestaurant
);


router.get('/get-restaurants', AuthMiddleware('super_admin'), RestaurantController.getRestaurants);
router.get('/get-single-restaurant/:restaurantId', RestaurantController.getSingleRestaurant)
router.get('/get-user-restaurants', AuthMiddleware(UserRole.user), RestaurantController.getUserRestaurants)
router.get('/get-owner-restaurants', AuthMiddleware(UserRole.admin), RestaurantController.getOwnerRestaurant)

router.put(
  "/change-restaurant-status/:restaurantId",
  AuthMiddleware(UserRole.super_admin),
  validationMiddleware(changeRestaurantStatusSchema),
  RestaurantController.changeRestaurantStatus
);

router.put(
  "/approve-restaurant/:restaurantId",
  AuthMiddleware(UserRole.super_admin),
  validationMiddleware(approveRestaurantSchema),
  RestaurantController.approveRestaurant
);

router.put(
  "/update-restaurant",
  AuthMiddleware(UserRole.admin),
  validationMiddleware(updateRestaurantValidationSchema),
  RestaurantController.updateRestaurant
);


router.put(
  "/update-restaurant-img",
  AuthMiddleware(UserRole.admin),
  upload.single('file'),
  RestaurantController.updateRestaurantImg
);


export const RestaurantRoutes = router;
