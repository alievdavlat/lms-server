import { NextFunction, Request, Response, json } from "express";
import { castAsynError } from "../../middleware/catchAsyncErrors";
import { ErrorHandler } from "../../utils/ErrorHandler";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { redis } from "../../config/redis.config";
import { acessTokenOptions, refreshTokenOptions } from "../../utils/jwt";


const updateAccessToken = castAsynError( async (req:Request, res:Response, next:NextFunction) => {
  try {

    
      const refresh_Token  = req.cookies.refresh_token as string;

      const decode = jwt.verify(refresh_Token, process.env.REFRESH_TOKEN as string) as JwtPayload;


      const message = 'Could not refresh token';

      if (!decode) {
        return next(new ErrorHandler(message, 400));
      }

      const session =  await redis.get(decode.id as string);
      
      if (!session) {
        return next(new ErrorHandler('Please login to access to resources', 400));
      }

      const user = JSON.parse(session);

      const accessToken = jwt.sign({id:user._id}, process.env.ACESS_TOKEN as string, {
        expiresIn:'5m'
      });

      const refreshToken = jwt.sign({id: user._id},  process.env.REFRESH_TOKEN as string, {
        expiresIn:'3d'
      });


    req.user = user;
    
    res.cookie('acess_token', accessToken, acessTokenOptions);
    res.cookie('refresh_token', refreshToken, refreshTokenOptions);

    await redis.set(user._id, JSON.stringify(user), 'EX', 604800) // 7 day

    next()

  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
})

export default updateAccessToken