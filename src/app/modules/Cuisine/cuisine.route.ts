import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import CuisineController from './cuisine.controller';
import { createCuisineValidationSchema } from './cuisine.validation';

const router = express.Router();

router.post('/create-cuisine', AuthMiddleware(UserRole.super_admin), validationMiddleware(createCuisineValidationSchema), CuisineController.createCuisine);


export const CuisineRoutes = router;