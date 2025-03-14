import express, { NextFunction, Request, Response } from 'express';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createAdminValidationSchema } from './admin.validation';
import AdminController from './admin.controller';
import upload from '../../helper/upload';

const router = express.Router();

router.post(
  "/create-admin",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validationMiddleware(createAdminValidationSchema),
  AdminController.createAdmin
);



export const AdminRoutes = router;
