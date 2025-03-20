import express, { NextFunction, Request, Response } from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import CuisineController from './cuisine.controller';
import { cuisineValidationSchema } from './cuisine.validation';
import upload from '../../helper/upload';

const router = express.Router();

router.post(
  "/create-cuisine",
  AuthMiddleware(UserRole.super_admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validationMiddleware(cuisineValidationSchema),
  CuisineController.createCuisine
);
router.get(
  "/get-cuisines",
  AuthMiddleware(UserRole.super_admin, UserRole.admin, UserRole.user),
  CuisineController.getCuisines
);
router.put(
  "/update-cuisine/:cuisineId",
  AuthMiddleware(UserRole.super_admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validationMiddleware(cuisineValidationSchema),
  CuisineController.updateCuisine
);
router.delete(
  "/delete-cuisine/:cuisineId",
  AuthMiddleware(UserRole.super_admin),
  CuisineController.deleteCuisine
);


export const CuisineRoutes = router;