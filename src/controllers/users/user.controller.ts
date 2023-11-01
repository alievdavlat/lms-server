import { Request, Response, NextFunction } from "express";
import userModel, { IUser} from "../../models/user.model";
import { ErrorHandler } from "../../utils/ErrorHandler";
import { castAsynError } from "../../middleware/catchAsyncErrors";
import { getAllUsersService, getUserById, updateUserRoleService } from "../../services/user.service";
import { IUpdatePassword, IUpdateProfilePicture, IUpdateUserInfo } from "../../types";
import { redis } from "../../config/redis.config";
import { removeFromCLoud, uploadToCloud } from "../../utils/uploader";







export default {

  getUserinfo : castAsynError(async (req:Request, res:Response, next:NextFunction) => {
    try {

      const userId = req.user?._id ;

      getUserById(userId, res)
      
    } catch (err) {
      return next(new ErrorHandler(err.message, 400))
    }
  }),

  updateUserInfo : castAsynError(async (req:Request, res:Response, next :NextFunction) => {
      try {
        const { name } = req.body as IUpdateUserInfo



        const userId = req.user?._id

        const user = await userModel.findById(userId)

       

        if (name && user) {
            user.name = name
        }

        await user?.save()

        await redis.set(userId, JSON.stringify(user))

        res.status(200).json({
          success:true,
          user
        })
      } catch (err) {
        return next(new ErrorHandler(err.message, 400))
      }
  }),

  updatePassword: castAsynError(async (req:Request, res:Response, next :NextFunction) => {
    try {
      
      const { oldPassword, newPassword} = req.body as IUpdatePassword

      if (!oldPassword  || !newPassword) {
        return next(new ErrorHandler("Please enter ol and new password", 400))
      }

      const userId = req.user?._id
      const user = await userModel.findById(userId).select('+password')

      

      if (user.password === undefined) {
        return next(new ErrorHandler('Invalid user', 400))
      }

      const isPasswordMatch = await user?.comparePassword(oldPassword)

      if (!isPasswordMatch) {
        return next(new ErrorHandler('Invalid old password', 400))
      }

      user.password = newPassword;

      await user.save()

      await redis.set(req.user?._id, JSON.stringify(user))

      res.status(201).json({
        status:201,
        success:true,
        user,
        msg:'user password successfully updated'
      })

    } catch (err) {
      return next(new ErrorHandler(err.message, 400))
    }
  }),

  updateProfilePicture: castAsynError(async (req:Request, res:Response, next:NextFunction) => {
    try {
     
     
      const userId = req.user._id
     
        
      const user = await userModel.findById(userId)

      

      if (req.file.fieldname  && user) {
        
        if (user?.avatar?.url) {
          await removeFromCLoud(user?.avatar.url)

          const  downloadURL =  await  uploadToCloud(req.file, 'avatars')
          user.avatar.url = downloadURL
        } else {
          const  downloadURL =  await  uploadToCloud(req.file, 'avatars')
          
          user.avatar.url = downloadURL
        }

      }

      
      
      user.save()

      await redis.set(userId, JSON.stringify(user))

      res.status(200).send({
        status:200,
        msg:'image uploaded'
      })

    } catch (err) {
      return next(new ErrorHandler(err.message, 400))
    }
  }),

  // only admin 
  getAllUser: castAsynError(async (req:Request, res:Response, next:NextFunction) => {
    try {
      getAllUsersService(res)
    } catch (err) {
      return next(new ErrorHandler(err.message, 400))
    }
  }),

  updateUserRole:castAsynError(async (req:Request, res:Response, next:NextFunction) => {
    try {
      const { id , role } = req.body;

      

      updateUserRoleService(res, id , role)

    } catch (err) {
      return next(new ErrorHandler(err.message, 400))
    }
  }),

  deleteUser: castAsynError(async (req:Request, res:Response, next:NextFunction) => {
    try {
      const { id } = req.params;

      const user = await userModel.findById(id)

      if (!user) {
        return next(new ErrorHandler('User not found', 404))
      }

      await removeFromCLoud(user.avatar.url)
      
      await user.deleteOne({id})

      await redis.del(id)

      res.status(200).json({
        status:200,
        user,
        msg:'user successfully deleted'
      })

      
    } catch (err) {
      return next(new ErrorHandler(err.message, 400))
    }
  })

  
}