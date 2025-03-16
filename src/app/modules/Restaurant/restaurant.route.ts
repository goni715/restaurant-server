import express from 'express';
import validationMiddleware from '../../middlewares/validationMiddleware';
import RestaurantController from './restaurant.controller';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import { approveRestaurantSchema, changeRestaurantStatusSchema, createRestaurantValidationSchema, } from './restaurant.validation';

const router = express.Router();

router.post(
  "/create-restaurant",
  AuthMiddleware(UserRole.admin),
  validationMiddleware(createRestaurantValidationSchema),
  RestaurantController.createRestaurant
);


router.get('/get-restaurants', AuthMiddleware('super_admin'), RestaurantController.getRestaurants)
router.get('/get-user-restaurants', RestaurantController.getUserRestaurants)
router.get('/get-owner-restaurants', AuthMiddleware(UserRole.admin), RestaurantController.getOwnerRestaurants)

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

router.get('/get-single-restaurant/:restaurantId', RestaurantController.getSingleRestaurant)


export const RestaurantRoutes = router;
