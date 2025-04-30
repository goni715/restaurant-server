import express from 'express';
import FaqController from './Faq.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createFaqValidationSchema, updateFaqValidationSchema } from './Faq.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import isAccess from '../../middlewares/isAccess';

const router = express.Router();

router.post(
  '/create-Faq',
  AuthMiddleware("super_admin", "administrator"),
  isAccess("settings"),
  validationMiddleware(createFaqValidationSchema),
  FaqController.createFaq,
);

router.get(
  '/get-faqs',
  AuthMiddleware("super_admin", "administrator", "owner", "user"),
  FaqController.getFaqs
);

router.patch(
  '/update-faq/:faqId',
  AuthMiddleware("super_admin", "administrator"),
  isAccess("settings"),
  validationMiddleware(updateFaqValidationSchema),
  FaqController.updateFaq,
);

router.delete(
  '/delete-faq/:faqId',
  AuthMiddleware("super_admin", "administrator"),
  isAccess("settings"),
  FaqController.deleteFaq,
);



const FaqRoutes = router;
export default FaqRoutes;
