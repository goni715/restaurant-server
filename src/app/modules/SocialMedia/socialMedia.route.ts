import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { socialMediaSchema } from './socialMedia.validation';
import SocialMediaController from './socialMedia.controller';

const router = express.Router();

router.post('/create-social-media', AuthMiddleware(UserRole.admin), validationMiddleware(socialMediaSchema), SocialMediaController.createSocialMedia);
router.get('/get-social-media-list', AuthMiddleware(UserRole.super_admin, UserRole.admin, UserRole.user), SocialMediaController.getSocialMediaList);
router.put('/update-social-media', AuthMiddleware(UserRole.admin), validationMiddleware(socialMediaSchema), SocialMediaController.updateSocialMedia);
router.delete('/delete-social-media/:restaurantId', AuthMiddleware(UserRole.admin),  SocialMediaController.deleteSocialMedia);


export const SocialMediaRoutes = router;