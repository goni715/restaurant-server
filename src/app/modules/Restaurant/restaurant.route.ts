import express from 'express';
import validationMiddleware from '../../middlewares/validationMiddleware';
import RestaurantController from './restaurant.controller';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import { createRestaurantValidationSchema } from './restaurant.validation';

const router = express.Router();

router.post(
  "/create-restaurant",
  AuthMiddleware(UserRole.super_admin),
  validationMiddleware(createRestaurantValidationSchema),
  RestaurantController.createRestaurant
);


router.get('/get-restaurants', RestaurantController.getRestaurants)



export const RestaurantRoutes = router;
