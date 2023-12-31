import { NextFunction, Request, Response } from "express";
import { castAsynError } from "../../middleware/catchAsyncErrors";
import { ErrorHandler } from "../../utils/ErrorHandler";
import userModel from "../../models/user.model";
import { sendToken } from "../../utils/jwt";
import { ISocialAuthBody } from "../../types";


const socialAuthController = castAsynError( async (req:Request, res:Response, next:NextFunction) => {
try {
    const { email , name , avatar } = req.body as ISocialAuthBody

    

    const user = await userModel.findOne(({email}))

    
    if (!user) {
      const userdata = avatar ?  {email, name, avatar} : {email, name}
      const newUser = await userModel.create(userdata)
     await sendToken(newUser, 201, res)
    } else{ 
     await sendToken(user, 200, res)
    }
    
} catch (err) {
  return next(new ErrorHandler(err.message , 400))
}
})

export default socialAuthController