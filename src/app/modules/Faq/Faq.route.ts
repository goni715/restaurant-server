import express from 'express';
import FaqController from './Faq.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createFaqValidationSchema, updateFaqValidationSchema } from './Faq.validation';

const router = express.Router();

router.post(
  '/create-Faq',
  validationMiddleware(createFaqValidationSchema),
  FaqController.createFaq,
);

router.get(
  '/:id',
  FaqController.getSingleFaq,
);

router.patch(
  '/:id',
  validationMiddleware(updateFaqValidationSchema),
  FaqController.updateFaq,
);

router.delete(
  '/:id',
  FaqController.deleteFaq,
);

router.get(
  '/',
  FaqController.getAllFaqs,
);

const FaqRoutes = router;
export default FaqRoutes;
