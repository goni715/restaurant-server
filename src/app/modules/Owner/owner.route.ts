import express, { NextFunction, Request, Response } from 'express';
import validationMiddleware from '../../middlewares/validationMiddleware';
import upload from '../../helper/upload';
import OwnerController from './owner.controller';
import { createOwnerValidationSchema } from './owner.validation';

const router = express.Router();

router.post(
  "/create-owner",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validationMiddleware(createOwnerValidationSchema),
  OwnerController.createOwner
);



export const OwnerRoutes = router;
