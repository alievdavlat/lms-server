import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../utils/ErrorHandler";
import {castAsynError} from '../../middleware/catchAsyncErrors'
import { ILoginRequest } from "../../types";
import userModel from "../../models/user.model";
import { sendToken } from "../../utils/jwt";


const LoginController = castAsynError( async ( req: Request, res: Response, next: NextFunction) => {
  try {
 
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next( new ErrorHandler('Please enter email or password', 400))
      };

      const user = await userModel.findOne({email}).select('+password');
      
      if (!user) {
        return next(new ErrorHandler('Invalid email or Password', 400))
      }

      const isPasswordMatch = await user.comparePassword(password)

      if (!isPasswordMatch) {
        return next(new ErrorHandler('Invalid email or Password', 400))
      }

     await sendToken(user, 200, res)
   
  } catch (err) {
   return next( new ErrorHandler(err.message, 400))
  }
 })

export default LoginController