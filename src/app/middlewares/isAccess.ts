import { NextFunction, Request, Response } from "express"
import { TAccess } from "../modules/Administrator/administrator.interface";
import AdministratorModel from "../modules/Administrator/administrator.model";



const isAccess = (access: TAccess) => {
    return async (req: Request, res:Response, next: NextFunction) : Promise<any> => {
        const loginUserId = req.headers.id;
        const role = req.headers.role;
        const AccessRoles = ["super_admin", "administrator"];

        //check if role is not super_admin or administrator
        if(!AccessRoles.includes(role as string)){
            return res.status(403).json({
                success: false,
                message: "You have no access",
                error: {
                  message: "You have no access",
                },
            });
        }

        //check if role is administrator
        if(role === "administrator"){
            const administrator = await AdministratorModel.findOne({
                userId: loginUserId
            });

            const accessList = administrator?.access;
            if(!accessList?.includes(access)){
                return res.status(403).json({
                    success: false,
                    message: "You have no access",
                    error: {
                      message: "You have no access",
                    },
                });
            }

            return next();
        }

        if(role === "super_admin"){
           return next()
        }   
    } 
}


export default isAccess;