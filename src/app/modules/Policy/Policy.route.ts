import express from 'express';
import PolicyController from './Policy.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createPolicyValidationSchema, updatePolicyValidationSchema } from './Policy.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import isAccess from '../../middlewares/isAccess';

const router = express.Router();

router.post(
  '/create-policy',
  AuthMiddleware("super_admin", "administrator"),
  isAccess("settings"),
  validationMiddleware(createPolicyValidationSchema),
  PolicyController.createPolicy,
);

router.get(
  '/get-policies',
  AuthMiddleware("super_admin", "administrator", "owner", "user"),
  PolicyController.getPolicies,
);

router.get(
  '/get-policy-by-type/:type',
  AuthMiddleware("super_admin", "administrator", "owner", "user"),
  PolicyController.getPolicyByType,
);

router.patch(
  '/update-policy/:type',
  AuthMiddleware("super_admin", "administrator"),
  isAccess("settings"),
  validationMiddleware(updatePolicyValidationSchema),
  PolicyController.updatePolicyByType,
);

router.delete(
  '/delete-policy-by-type/:type',
  AuthMiddleware("super_admin", "administrator"),
  isAccess("settings"),
  PolicyController.deletePolicyByType,
);



const PolicyRoutes = router;
export default PolicyRoutes;
