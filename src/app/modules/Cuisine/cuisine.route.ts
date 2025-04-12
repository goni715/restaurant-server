import express, { NextFunction, Request, Response } from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import CuisineController from './cuisine.controller';
import { cuisineValidationSchema } from './cuisine.validation';
import upload from '../../helper/upload';
import isAccess from '../../middlewares/isAccess';

const router = express.Router();

router.post(
  "/create-cuisine",
  AuthMiddleware(UserRole.super_admin, UserRole.administrator),
  isAccess("restaurantManagement"),
  upload.single('file'),
  validationMiddleware(cuisineValidationSchema),
  CuisineController.createCuisine
);
router.get(
  "/get-cuisines",
  AuthMiddleware(UserRole.super_admin, UserRole.admin, UserRole.user, UserRole.administrator),
  CuisineController.getCuisines
);
router.patch(
  "/update-cuisine/:cuisineId",
  AuthMiddleware(UserRole.super_admin, UserRole.administrator),
  isAccess("restaurantManagement"),
  upload.single('file'),
  validationMiddleware(cuisineValidationSchema),
  CuisineController.updateCuisine
);
router.delete(
  "/delete-cuisine/:cuisineId",
  AuthMiddleware(UserRole.super_admin, UserRole.administrator),
  isAccess("restaurantManagement"),
  CuisineController.deleteCuisine
);


export const CuisineRoutes = router;