import { Response } from "express";
import { castAsynError } from "../middleware/catchAsyncErrors";
import CourseModel from "../models/course.model";
import { redis } from "../config/redis.config";


export const createCourse = castAsynError( async ( data , res:Response) => {


  const course = await CourseModel.create(data);

  
  await redis.set(course._id, JSON.stringify(course))

  res.status(201).json({
    status:201,
    data:course,
    msg:'created'
  })

})


export const getAllCoursesService = async (res:Response) => {
  const courses = await CourseModel.find().sort({createdAt:-1})

  res.status(200).json({
    status:200,
    courses,
    msg:'ok'
  })
}