
import { NextFunction, Request, Response } from 'express'
import {castAsynError} from '../../middleware/catchAsyncErrors'
import { ErrorHandler } from '../../utils/ErrorHandler'
import { redis } from '../../config/redis.config'


const logOutController  =  castAsynError(async (req:Request, res:Response, next:NextFunction) => {
  try {
    res.cookie('acess_token', '', {maxAge:1})
    res.cookie('refresh_token', '', {maxAge:1})

    redis.del(req.user?._id)

    res.status(200).json({
      success:true,
      message:'Logged out successfully '
    })
  } catch (err) {
    return next(new ErrorHandler(err.message, 400))
  }
}) 


//validate user roles 


const authorizeRole = (...roles:string[]) => {
  return (req:Request, res:Response, next:NextFunction ) => {
    if(!roles.includes(req.user.role || '')){
      return next( new ErrorHandler(`Role ${req.user?.role} is not allowed to access this resource`, 403))
    }

   

    next()
  }
}

export {
  logOutController,
  authorizeRole
} 