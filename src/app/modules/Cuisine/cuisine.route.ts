import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import CuisineController from './cuisine.controller';
import { cuisineValidationSchema } from './cuisine.validation';

const router = express.Router();

router.post('/create-cuisine', AuthMiddleware(UserRole.super_admin), validationMiddleware(cuisineValidationSchema), CuisineController.createCuisine);
router.get('/get-cuisines', AuthMiddleware(UserRole.super_admin, UserRole.admin, UserRole.user), CuisineController.getCuisines);
router.put('/update-cuisine/:cuisineId', AuthMiddleware(UserRole.super_admin), validationMiddleware(cuisineValidationSchema), CuisineController.updateCuisine);
router.delete('/delete-cuisine/:cuisineId', AuthMiddleware(UserRole.super_admin), CuisineController.deleteCuisine);


export const CuisineRoutes = router;