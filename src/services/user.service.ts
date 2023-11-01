import { Response } from "express";
import userModel from "../models/user.model"
import { redis } from "../config/redis.config";


export const getUserById = async (id : string, res:Response) => {
 
  const user = await userModel.findById(id)
  
  if (user) {
  
  res.status(200).json({
    success:true,
    user
  })
}
}


export const getAllUsersService = async (res:Response) => {
  const users = await userModel.find().sort({createdAt:-1})

  res.status(200).json({
    status:200,
    users,
    msg:'ok'
  })
}


export const updateUserRoleService = async (res:Response, id:string , role:string ) => {
  const user = await userModel.findByIdAndUpdate(id, { role}, { new:true})

  

  res.status(200).json({
    status:200,
    user,
    msg:'ok'
  })

  
}