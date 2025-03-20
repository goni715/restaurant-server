import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import MenuController from './menu.controller';
import { createMenuValidationSchema } from './menu.validation';

const router = express.Router();

router.post('/create-menu', AuthMiddleware(UserRole.admin), validationMiddleware(createMenuValidationSchema), MenuController.createMenu);
router.post('/get-menus/:restaurantId', AuthMiddleware(UserRole.admin), validationMiddleware(createMenuValidationSchema), MenuController.createMenu);



export const MenuRoutes = router;