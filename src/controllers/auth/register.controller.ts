import { Request, Response, NextFunction } from "express";
import userModel from "../../models/user.model";
import { ErrorHandler } from "../../utils/ErrorHandler";
import { castAsynError } from "../../middleware/catchAsyncErrors";
import { IRegisterationBody } from "../../types";
import { createActivationToken } from "../../utils/jwt";
import path from "path";
import ejs from 'ejs'
import senMail from "../../utils/sendMail";




const registerUserController =  castAsynError(async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { name , email, password  } = req.body 
    

    const isEmailExist = await userModel.findOne({email})

    if (isEmailExist) {
        return next( new ErrorHandler('Email already exist' , 400))
    }

    const user:IRegisterationBody = {
      name,
      email,
      password
    }

    const activationToken = createActivationToken(user);

    const activationCode = activationToken.activationCode;

    const data = { user: { name :user.name}, activationCode};

    const html = await ejs.renderFile(path.join(process.cwd(),'src', 'views','mails', 'activation-mail.ejs'), data)


    try {
        await senMail({
          email: user.email,
          subject:'Activate your account',
          template:"activation-mail.ejs",
          data,
        })

      res.status(201).json({
        success:true,
        message:`Please  check you email: ${user.email} to activate your account!`,
        activationToken:activationToken.token
      })

    } catch (err:any) {
      return next( new ErrorHandler(err.message, 400 ))
    }

  } catch (err:any) {
    return next( new ErrorHandler(err.message , 400))
  }

})


export default registerUserController



