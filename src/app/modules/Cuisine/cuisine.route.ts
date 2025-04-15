import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import CuisineController from './cuisine.controller';
import upload from '../../helper/upload';
import isAccess from '../../middlewares/isAccess';
import { createCuisineValidationSchema, updateCuisineValidationSchema } from './cuisine.validation';

const router = express.Router();

router.post(
  "/create-cuisine",
  AuthMiddleware(UserRole.super_admin, UserRole.administrator),
  isAccess("restaurant"),
  upload.single('file'),
  validationMiddleware(createCuisineValidationSchema),
  CuisineController.createCuisine
);
router.get(
  "/get-cuisines",
  AuthMiddleware(UserRole.super_admin, UserRole.user, UserRole.administrator),
  CuisineController.getCuisines
);
router.get(
  "/get-cuisine-drop-down",
  AuthMiddleware(UserRole.owner),
  CuisineController.getCuisineDropDown
);
router.patch(
  "/update-cuisine/:cuisineId",
  AuthMiddleware(UserRole.super_admin, UserRole.administrator),
  isAccess("restaurant"),
  upload.single('file'),
  validationMiddleware(updateCuisineValidationSchema),
  CuisineController.updateCuisine
);
router.delete(
  "/delete-cuisine/:cuisineId",
  AuthMiddleware(UserRole.super_admin, UserRole.administrator),
  isAccess("restaurant"),
  CuisineController.deleteCuisine
);


export const CuisineRoutes = router;