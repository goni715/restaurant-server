import express from 'express';
import OwnerController from './Owner.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createOwnerValidationSchema, updateOwnerValidationSchema } from './Owner.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import isAccess from '../../middlewares/isAccess';

const router = express.Router();

router.post(
  '/create-owner',
  AuthMiddleware(UserRole.super_admin, UserRole.administrator),
  isAccess('owner'),
  validationMiddleware(createOwnerValidationSchema),
  OwnerController.createOwner
);
router.get(
  "/get-owners",
  AuthMiddleware(UserRole.super_admin, UserRole.administrator),
  OwnerController.getOwners
);
router.patch(
  '/update-owner/:ownerId',
  AuthMiddleware(UserRole.super_admin, UserRole.administrator),
  isAccess('owner'),
  validationMiddleware(updateOwnerValidationSchema),
  OwnerController.updateOwner,
);
router.delete(
  '/delete-owner/:ownerId',
  AuthMiddleware(UserRole.super_admin, UserRole.administrator),
  isAccess('owner'),
  OwnerController.deleteOwner,
);

const OwnerRoutes = router;
export default OwnerRoutes;
