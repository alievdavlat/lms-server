import { Request, Response, NextFunction } from "express";
import { castAsynError } from "./catchAsyncErrors";
import { ErrorHandler } from "../utils/ErrorHandler";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { redis } from "../config/redis.config";

export const isAuthenticated = castAsynError(async (req:Request, res:Response, next:NextFunction) => {


  
  const access_token = req.cookies.acess_token;
  
  

  if (!access_token) {
    return next(new ErrorHandler('Please login to access to resource', 401))
  }
  const decoded = jwt.verify(access_token, process.env.ACESS_TOKEN as string) as JwtPayload


  if (!decoded) {
    return next(new ErrorHandler(' access token is not valid', 403))
  }

  const user = await redis.get(decoded.id) 

  if (!user) {
    return next(new ErrorHandler('Please login to access to resource', 404))
  }

  req.user = JSON.parse(user);
  
  next()

})

export default isAuthenticated