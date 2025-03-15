import express, { NextFunction, Request, Response } from 'express';
import validationMiddleware from '../../middlewares/validationMiddleware';
import RestaurantController from './restaurant.controller';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';

const router = express.Router();

router.post(
  "/create-restaurant",
  AuthMiddleware(UserRole.super_admin),
  RestaurantController.createRestaurant
);




export const RestaurantRoutes = router;
