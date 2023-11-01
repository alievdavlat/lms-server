import { NextFunction, Request, Response } from "express"
import { castAsynError } from "../../middleware/catchAsyncErrors"
import { ErrorHandler } from "../../utils/ErrorHandler"
import OrderModel, { IOrder } from "../../models/orders.model"
import userModel from "../../models/user.model"
import CourseModel from "../../models/course.model"
import NoteficationModel from "../../models/notefication.model"
import path from "path"
import ejs from 'ejs'
import senMail from "../../utils/sendMail"
import { getAllOrdersService, newOrder } from "../../services/order.service"
import { redis } from "../../config/redis.config"

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)




export default {

createOrder: castAsynError(async (req:Request, res:Response, next:NextFunction) => {

  try {
    
    const { courseId , payment_info } = req.body as IOrder
    
    if (payment_info) {
        if ("id" in payment_info) {
          const paymentIntentId  = payment_info.id
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId, 
          )

          if (paymentIntent.status !== 'succeeded') {
            return next(new ErrorHandler('Payment not authorized', 400) )
          }
        }
    }

    const userId = req.user?._id

    const user = await userModel.findById(userId)
    

    const courseExistInUser = user?.courses?.some((course:any) => course?._id ==  courseId)
    

    
    
    if (courseExistInUser) {
      return next(new ErrorHandler('User already purchased this course', 400))
    }

    const course = await CourseModel.findById(courseId)
    
    if (!course) {
      return next(new ErrorHandler('Course not found', 400))
    }

    const data:any = {
      courseId,
      userId:user?._id,
      payment_info
    }

    
    const mailData = {
      order: {
        _id: course?._id.toString().slice(0, 6),
        name:course?.name,
        price:course?.price,
        date: new Date().toLocaleDateString('en-Us', { year: 'numeric', month:'long', day:'numeric'}),

      }
    }

    const html = await ejs.renderFile(path.join(process.cwd(), 'src', 'views', 'mails', 'order-confirmation.ejs'), { order:mailData})

    try {
      if (user) {
        await senMail({
          email:user?.email,
          subject: 'Order confirmation',
          template: 'order-confirmation.ejs',
          data: mailData
        });
      }
    } catch (err) {
      return next(new ErrorHandler(err.message + 'ii', 500))
    }

    user?.courses.push(course?._id);

    await redis.set(req.user._id, JSON.stringify(user))

    await user?.save()

    await  NoteficationModel.create({
      userId: user?._id,
      title:'New Order',
      message:`You have a new order from ${course?.name}`
    })

    if (course) {
      course.purchased += 1;
    }

    await course?.save()
    
    newOrder(data, res, next)
   

  } catch (err) {
    return next(new ErrorHandler(err.message  + 'bb', 500))
  }

}),

getAllOrders: castAsynError(async (req:Request, res:Response, next:NextFunction) => {
  try {
    getAllOrdersService(res)
  } catch (err) {
    return next(new ErrorHandler(err.message, 400))
  }
}),

sendStripePublishKey:castAsynError(async (req:Request, res:Response, next:NextFunction) => {
  res.status(200).json({
    publishKey:process.env.STRIPE_PUBLISH_KEY
  })
}),

newPayment:castAsynError(async (req:Request, res:Response, next:NextFunction) => {
  try {
    
    const myPayment = await stripe.paymentIntents.create({
      amount:req.body.amount,
      currency:'USD',
      metadata:{
        company:'Openhemier',
      },
      automatic_payment_methods:{
        enabled:true
      }
    })


    res.status(201).json({
      status:201,
      client_secret:myPayment.client_secret 
    })
  } catch (err) {
    return next(new ErrorHandler(err.message, 500))
  }
})


}