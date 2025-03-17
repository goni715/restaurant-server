import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import FavouriteController from './favourite.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { addOrRemoveFavouriteSchema } from './favourite.validation';

const router = express.Router();

router.post('/add-or-remove-favourite', AuthMiddleware(UserRole.user), validationMiddleware(addOrRemoveFavouriteSchema), FavouriteController.addOrRemoveFavourite);
router.get('/get-favourite-list', AuthMiddleware(UserRole.user), FavouriteController.getFavouriteList);


export const FavouriteRoutes = router;