import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import ScheduleController from './schedule.controller';

const router = express.Router();

router.post(
  "/create-schedule",
  AuthMiddleware(UserRole.admin),
  ScheduleController.createSchedule
);



export const ScheduleRoutes = router;