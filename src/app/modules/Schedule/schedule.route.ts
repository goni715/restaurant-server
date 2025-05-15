import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import ScheduleController from './schedule.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createScheduleSchema } from './schedule.validation';

const router = express.Router();

router.post(
  "/create-schedule",
  AuthMiddleware(UserRole.owner),
  validationMiddleware(createScheduleSchema),
  ScheduleController.createSchedule
);

router.get(
  "/get-schedules",
  AuthMiddleware(UserRole.owner),
  ScheduleController.getSchedules
);
router.get(
  "/get-schedules-by-date/:date",
  AuthMiddleware(UserRole.owner),
  ScheduleController.getSchedulesByDate
);
router.get(
  "/get-schedule-drop-down",
  AuthMiddleware(UserRole.owner),
  ScheduleController.getScheduleDropDown
);

router.get(
  "/get-single-schedule/:scheduleId",
  AuthMiddleware(UserRole.owner),
  ScheduleController.getSingleSchedule
);

router.delete(
  "/delete-schedule/:scheduleId",
  AuthMiddleware(UserRole.owner),
  ScheduleController.deleteSchedule
);

export const ScheduleRoutes = router;