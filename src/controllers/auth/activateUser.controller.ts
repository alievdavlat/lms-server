import { NextFunction, Request, Response } from "express";
import { castAsynError } from "../../middleware/catchAsyncErrors";
import { ErrorHandler } from "../../utils/ErrorHandler";
import { IActivationRequest } from "../../types";
import userModel, { IUser } from "../../models/user.model";
import jwt from 'jsonwebtoken'



const activateUsersController = castAsynError(async (req : Request,res:Response , next:NextFunction) => {
  try {
      const { activation_token, activation_code} = req.body as IActivationRequest
      const newUser:{ user : IUser;  activationCode:string} = 
      jwt.verify(activation_token, process.env.ACTIVATION_SECRET_KEY) as { user : IUser;  activationCode:string}
  
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler('Invalid Activation code', 400))
      }
  
      const { name , email, password } = newUser.user
  
      const existUser = await userModel.findOne({email})
  
      if (existUser) {
        return next(new ErrorHandler('Email already exist', 400))
      }
  
      const user = await userModel.create({
        name, email, password
      });
  
      res.status(201).json({
        success:true
      })
  
  } catch (err) {
     return next( new ErrorHandler(err.message , 400))
  }
  }) 

  export default activateUsersController