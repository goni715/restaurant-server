import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { diningValidationSchema } from './dining.validation';
import DiningController from './dining.controller';

const router = express.Router();

router.post('/create-dining', AuthMiddleware(UserRole.super_admin), validationMiddleware(diningValidationSchema), DiningController.createDining);
router.get('/get-dining-list', AuthMiddleware(UserRole.super_admin, UserRole.admin, UserRole.user), DiningController.getDiningList);
router.put('/update-dining/:diningId', AuthMiddleware(UserRole.super_admin), validationMiddleware(diningValidationSchema), DiningController.updateDining);
router.delete('/delete-dining/:diningId', AuthMiddleware(UserRole.super_admin),  DiningController.deleteDining);


export const DiningRoutes = router;