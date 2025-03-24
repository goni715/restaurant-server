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

router.get(
  "/get-schedules",
  AuthMiddleware(UserRole.admin),
  ScheduleController.getSchedules
);

router.get(
  "/get-user-schedules/:restaurantId",
  AuthMiddleware(UserRole.user),
  ScheduleController.getUserSchedules
);

router.get(
  "/get-single-schedule/:scheduleId",
  AuthMiddleware(UserRole.admin),
  ScheduleController.getSingleSchedule
);

router.delete(
  "/delete-schedule/:scheduleId",
  AuthMiddleware(UserRole.admin),
  ScheduleController.deleteSchedule
);

export const ScheduleRoutes = router;