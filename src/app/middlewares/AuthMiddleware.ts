import { NextFunction, Request, Response } from "express";
import config from "../config";
import { Secret } from "jsonwebtoken";
import verifyToken from "../utils/verifyToken";
import UserModel from "../modules/User/user.model";

type TUserRole = "user" | "admin";

const AuthMiddleware = (...roles: TUserRole[]) => {
  return async (req: Request & {user?: any}, res: Response, next: NextFunction) : Promise<any> => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized",
          error: {
            message: "jwt token must be provided"
          }
        });
      }

      //console.log(token);

      //token-verify
      const decoded = verifyToken(
        token,
        config.jwt_access_secret as Secret
      );


      //check if role is matching
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(401).json({
             success: false,
             message: "You are not authorized",
             error: {
               message: `Please, provide ${roles.join(' or ')} token`
             }
        });
      }


      const user = await UserModel.findOne({ email: decoded.email });
   
      //check if user is not exist
      if (!user) {
        return res.status(401).json({
             success: false,
             message: "You are not authorized",
             error: {
               message: "This user is not existed"
             }
        });
      }


      req.user = decoded;

      //set id & email to headers
      req.headers.email= decoded.email;
      req.headers.id= decoded.id;
      req.headers.role= decoded.role;
     
      next()

    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: "You are not authorized",
        error: {
          message: err.message
        }
      });
    }
  };
};

export default AuthMiddleware;