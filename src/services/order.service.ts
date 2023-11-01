


import { NextFunction,Response } from "express";
import { castAsynError } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/orders.model";


export const newOrder = castAsynError(async (data:any,  res:Response, next:NextFunction) => {
  const order = await OrderModel.create(data)
  
  res.status(201).json({
    status:201,
    order,
    msg:"ok"
  })

})


export const getAllOrdersService = async (res:Response) => {
  const orders = await OrderModel.find().sort({createdAt:-1})

  res.status(200).json({
    status:200,
    orders,
    msg:'ok'
  })
}
