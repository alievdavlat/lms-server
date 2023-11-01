import { Request, Response, NextFunction } from "express"
import { ErrorHandler } from "../../utils/ErrorHandler"
import { castAsynError } from "../../middleware/catchAsyncErrors"
import { generateLast12MonthData } from "../../utils/analyticsGenerator"
import userModel from "../../models/user.model"
import CourseModel from "../../models/course.model"
import OrderModel from "../../models/orders.model"


export default {

// user data analytcis

getUsersAnalytics: castAsynError(async (req:Request, res:Response, next : NextFunction) => {
  try {
    
    const users  = await generateLast12MonthData(userModel)

    res.status(200).json({
      status:200,
      users,
      msg:'ok'
    })

  } catch (err) {
    return next(new ErrorHandler(err.message, 500))
  }
}),


getCoursesAnalytics: castAsynError(async (req:Request, res:Response, next : NextFunction) => {
  try {
    
    const courses  = await generateLast12MonthData(CourseModel)

    res.status(200).json({
      status:200,
      courses,
      msg:'ok'
    })

  } catch (err) {
    return next(new ErrorHandler(err.message, 500))
  }
}),

getOrderAnalytics: castAsynError(async (req:Request, res:Response, next : NextFunction) => {
  try {
    
    const orders  = await generateLast12MonthData(OrderModel)

    res.status(200).json({
      status:200,
      orders,
      msg:'ok'
    })

  } catch (err) {
    return next(new ErrorHandler(err.message, 500))
  }
})



}