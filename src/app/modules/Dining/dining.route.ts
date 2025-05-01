import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { diningValidationSchema } from './dining.validation';
import DiningController from './dining.controller';

const router = express.Router();

router.post(
  "/create-dining",
  AuthMiddleware(UserRole.owner),
  validationMiddleware(diningValidationSchema),
  DiningController.createDining
);
router.get(
  "/get-dining-list",
  AuthMiddleware(UserRole.owner),
  DiningController.getDiningList
);
router.get(
  "/get-dining-drop-down",
  AuthMiddleware(UserRole.owner),
  DiningController.getDiningDropDown
);
router.get(
  "/get-my-dinings",
  AuthMiddleware(UserRole.owner),
  DiningController.getMyDinings
);
router.patch(
  "/update-dining/:diningId",
  AuthMiddleware(UserRole.owner),
  validationMiddleware(diningValidationSchema),
  DiningController.updateDining
);
router.delete(
  "/delete-dining/:diningId",
  AuthMiddleware(UserRole.super_admin),
  DiningController.deleteDining
);


export const DiningRoutes = router;