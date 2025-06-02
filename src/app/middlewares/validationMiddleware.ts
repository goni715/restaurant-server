import { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";

//const validationMiddleware = (schema: ZodObject<any> | ZodEffects<any>) => {
const validationMiddleware = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = await schema.parseAsync({
        ...req.body,
        ...req.cookies,
      });
      req.body = parsedData;
      next();

    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((e) => {
          if (e.path.length > 0) {
            formattedErrors[e.path.join(".")] = e.message;
          }
        });

        //first error message
        const firstErrorMessage = error.errors[0]?.message || "Invalid input";

        return res.status(400).json({
          success: false,
          message: firstErrorMessage,
          error: formattedErrors,
        });
      }
    }
  };
};

export default validationMiddleware;
