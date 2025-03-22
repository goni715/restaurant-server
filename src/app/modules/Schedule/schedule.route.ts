import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import ScheduleController from './schedule.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createScheduleSchema } from './schedule.validation';

const router = express.Router();

router.post(
  "/create-schedule",
  AuthMiddleware(UserRole.admin),
  validationMiddleware(createScheduleSchema),
  ScheduleController.createSchedule
);



export const ScheduleRoutes = router;