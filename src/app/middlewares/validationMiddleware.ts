import { NextFunction, Request, Response } from "express"
import { ZodTypeAny } from "zod";


//const validationMiddleware = (schema: ZodObject<any> | ZodEffects<any>) => {
    const validationMiddleware = (schema: ZodTypeAny ) => {

    return async (req:Request, res:Response, next: NextFunction)=> {
        try{
            const parsedData = await schema.parseAsync({...req.body, ...req.cookies});
            req.body=parsedData;
            next();
        }
        catch(err){
            next(err)
        }
    }
}

export default validationMiddleware;