import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import FavouriteController from './favourite.controller';

const router = express.Router();

router.post('/add-or-remove-favourite', AuthMiddleware(UserRole.user), FavouriteController.addOrRemoveFavourite);
router.get('/get-favourite-file-or-folder', AuthMiddleware(UserRole.user), FavouriteController.getFavouriteList);


export const FavouriteRoutes = router;