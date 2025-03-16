import express from 'express';
import validationMiddleware from '../../middlewares/validationMiddleware';
import RestaurantController from './restaurant.controller';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import { changeRestaurantStatusSchema, createRestaurantValidationSchema, } from './restaurant.validation';

const router = express.Router();

router.post(
  "/create-restaurant",
  AuthMiddleware(UserRole.admin),
  validationMiddleware(createRestaurantValidationSchema),
  RestaurantController.createRestaurant
);


router.get('/get-restaurants', RestaurantController.getRestaurants)
router.put(
  "/change-restaurant-status/:restaurantId",
  AuthMiddleware(UserRole.super_admin),
  validationMiddleware(changeRestaurantStatusSchema),
  RestaurantController.changeRestaurantStatus
);

router.get('/get-single-restaurant/:restaurantId', RestaurantController.getSingleRestaurant)


export const RestaurantRoutes = router;
