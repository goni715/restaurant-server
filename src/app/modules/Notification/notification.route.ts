import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import NotificationController from './notification.controller';

const router = express.Router();

router.post('/create-notification', AuthMiddleware(UserRole.admin, UserRole.super_admin, UserRole.user), NotificationController.createNotification);


export const NotificationRoutes = router;