
import {Response, Request, NextFunction} from 'express'
import { castAsynError } from '../../middleware/catchAsyncErrors'
import { ErrorHandler } from '../../utils/ErrorHandler'
import { uploadToCloud, removeFromCLoud } from '../../utils/uploader'
import { createCourse, getAllCoursesService } from '../../services/course.service'
import CourseModel from '../../models/course.model'
import { redis } from '../../config/redis.config'
import { IAddAnswerData, IAddQuestionData, IAddReplyReviewData, IAddReviewData } from '../../types'
import mongoose from 'mongoose'
import path from 'path'
import ejs from 'ejs'
import senMail from '../../utils/sendMail'
import NoteficationModel from '../../models/notefication.model'
import axios from 'axios'

export default {

uploadCourse: castAsynError( async (req:Request, res:Response, next :NextFunction) => {
  try {
    
    
    const data = req.body
  
  
    if (req?.file) {
       const thumbnailUrl = await uploadToCloud(req?.file, 'courses') 
       
       const newData = {...data, thumbnail: thumbnailUrl}
       
       createCourse(newData, res, next)
    }


  } catch (err) {
    return next(new ErrorHandler(err.message, 400))
  }
}),

editCourse: castAsynError( async (req:Request, res:Response, next:NextFunction) => {
  try {
    const body = req.body
    const  thumbnail  = req.file.fieldname as any
    const { id } = req.params

    

    if (!id) {
      return next(new ErrorHandler('course id required', 400))
    }

    let data:object;
    
    const course = await CourseModel.findById(id)

    if (thumbnail) {
       removeFromCLoud(course.thumbnail)

       const newThumbnailurl = await uploadToCloud(req.file, 'courses')
       data = { ...body, thumbnail: newThumbnailurl}
      
      }
      
      
      if (!data) {
        return next(new ErrorHandler('course not updated plsease try again', 400))
      }
      
      const updatedCourse = await CourseModel.findByIdAndUpdate(id, {$set:data}, {new:true})
      await redis.set(updatedCourse._id, JSON.stringify(updatedCourse), 'EX', 604800)

      
      res.status(200).json({
        status:200,
        data:updatedCourse,
        msg:'updated'
      });

  } catch (err) {
    return next(new ErrorHandler(err.message, 400))
  }
}),

getAllCourse: castAsynError(async (req:Request, res:Response, next:NextFunction) => {
  try {


    const isCashExist = await redis.get('allCourses')

    const courses = await CourseModel.find().select('-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links')
    
    if(courses) {
    await redis.set('allCourses', JSON.stringify(courses))

    res.status(200).json({
      status:200,
      data:courses,
      msg:'ok'
    })
  } else {
    const course = JSON.parse(isCashExist)
      res.status(200).json({
        status:200,
        data:course,
        msg:'ok'
      })
  }


  } catch (err) {
    return next(new ErrorHandler(err.message, 400))
  }
}),

getSingleCourse: castAsynError(async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { id } = req.params
    
    if (!id) {
      return next(new ErrorHandler('course id required', 400))
    }

    const isCashExist = await redis.get(id)

    if (isCashExist) {
      const course = JSON.parse(isCashExist)
      res.status(200).json({
        status:200,
        data:course,
        msg:'ok'
      })
    } else {

      const course = await CourseModel.findById(id).select('-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links');

      await redis.set(id, JSON.stringify(course), 'EX', 604800) //7 days

      res.status(200).json({
        status:200,
        data:course,
        msg:'ok'
      })

    }
   
    
  } catch (err) {
    return next(new ErrorHandler(err.message, 400))
  }
}),

// only for valid users 
getCourseByUser: castAsynError(async (req:Request, res:Response, next:NextFunction) => {

 try {
  const userCourseLits = req.user?.courses;
  const courseId = req.params.id

  const courseExist = userCourseLits?.find((course:any) => course?._id == courseId)

  
  
  if (!courseExist) {
    return next(new ErrorHandler('you cannot access this course', 400))
  }
 
  const course = await CourseModel.findById(courseId)

  const content = course?.courseData

  res.status(200).json({
    status:200,
    content,
    msg:"Success"
  })

 } catch (err) {
  return next(new ErrorHandler(err.message, 400))
 }


}),

// course questions  

addQuestion: castAsynError(async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { question, courseId , contentId }: IAddQuestionData = req.body ;

    const course = await CourseModel.findById(courseId)

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler('Invalid content id', 400))
    }

    const courseContent = course?.courseData.find((item:any) => item?._id.equals(contentId))

    if (!courseContent) {
      return next(new ErrorHandler('Invalid content id', 400))
    }

    const newQuestion:any = {
      user: req.user,
      question,
      questionReplies:[]
    }



    courseContent.questions.push(newQuestion);

    await  NoteficationModel.create({
      userId:req.user?._id,
      title:'New Question Recived',
      message:`You have a new Question in ${courseContent?.title}`
    })

    await course?.save()
    await redis.set(course._id, JSON.stringify(course), 'EX', 604800)


    res.status(200).json({
      status:200,
      course,
      msg:'ok'
    })

    
  } catch (err) {
    return next(new ErrorHandler(err.message, 500))
  }
}) ,

addAnswerQuestion: castAsynError(async (req:Request, res:Response, next:NextFunction) => {
try {
        const { answer, courseId, contentId, questionId }:IAddAnswerData  = req.body

        const course = await CourseModel.findById(courseId)


        if (!mongoose.Types.ObjectId.isValid(contentId)) {
          return next(new ErrorHandler('Invalid content id', 400))
        }
    

        const courseContent = course?.courseData.find((item:any) => item?._id.equals(contentId))
    

        if (!courseContent) {
          return next(new ErrorHandler('Invalid content id', 400))
        }


        const question = courseContent?.questions.find((item:any) => item?._id.equals(questionId))


        if (!question) {
          return next(new ErrorHandler('Invalid question id', 400))
        }

        const newAnswer:any = {
          user:req.user,
          answer
        }

        question.questionReplies.push(newAnswer);

        await course?.save()
        await redis.set(course._id, JSON.stringify(course), 'EX', 604800)


        if (req.user?._id === question.user._id) {
            await NoteficationModel.create({
              user:req.user?._id,
              title:'New Question Reply Received',
              message:`You have a new  question reply in  ${courseContent.title}`
            })


        } else {

          const data = {
            name:question?.user?.name,
            title:courseContent?.title
          }

          const html = await ejs.renderFile(path.join(process.cwd(), 'src', 'views','mails', 'question-reply.ejs'), data)

            try {
              await senMail({
                email:question?.user?.email,
                subject:'Question Reply',
                template: 'question-reply.ejs',
                data
              })
            } catch (err) {
              return next(new ErrorHandler(err.message, 400))
            }
        }


        res.status(200).json({
          status:200,
          course,
          msg:'ok'
        })

} catch (err) {
  return next(new ErrorHandler(err.message, 500))
}
}),

addReview : castAsynError(async (req:Request, res:Response, next:NextFunction) => {
try {
  const userCourseLits = req.user?.courses;

  

  const courseId  = req.params.id;

  
  
  const courseExist = userCourseLits.some((course:any) => course._id == courseId)

  

  if (!courseExist) {
    return next(new ErrorHandler('you cannot access to this course', 400))
  }

  const course = await CourseModel.findById(courseId)
  const {  review , rating } = req.body as IAddReviewData

  const reviewData : any  = {
    user: req.user,
    comment:review,
    rating
  }

  course.reviews.push(reviewData)

  let avg = 0;

  course?.reviews?.forEach((rev:any) => {
    avg += rev.rating
  });

 if (course) {
  course.ratings = avg / course.reviews.length
 }

 await course?.save()
 await redis.set(course._id, JSON.stringify(course), 'EX', 604800)

//  notification create 
await NoteficationModel.create({
  user:req.user._id,
  title:'New Review Recived',
  message:`${req.user?.name} has given a review in ${course?.name}`,
 })

res.status(200).json({
  status:200,
  course,
  msg:'ok'
})




} catch (err) {
  return next(new ErrorHandler(err.message, 500))
}
}),

addReplyReview:  castAsynError(async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { comment, courseId, reviewId} = req.body as IAddReplyReviewData

    const course = await CourseModel.findById(courseId)

    if (!course) {
      return next(new ErrorHandler('Course not found', 494))
    }

    const review = course?.reviews?.find((rev:any) => rev._id == reviewId)

    if (!review) {
      return next(new ErrorHandler('Reviw not found', 404))
    }

    const replyData:any = {
      user:req.user,
      comment,
    }

    if (!review.commentReplies) {
      review.commentReplies = [];
    }

    review?.commentReplies?.push(replyData)

    await course?.save()
    await redis.set(course._id, JSON.stringify(course), 'EX', 604800)

    const date = {
      createdAt:Date.now(),
      updatedAt:Date.now()

    }

    res.status(200).json({
      status:200,
      date,
      msg:"ok"
    })
    
  } catch (err) {
    return next(new ErrorHandler(err.message, 500))
  }
}),

//for admin
getAllCourses: castAsynError(async (req:Request, res:Response, next:NextFunction) => {
  try {
    getAllCoursesService(res)
  } catch (err) {
    return next(new ErrorHandler(err.message, 400))
  }
}),

deleteCourse: castAsynError(async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { id } = req.params;

    const course = await CourseModel.findById(id)
    console.log(course);
    
    if (!course) {
      return next(new ErrorHandler('Course not found', 404))
    }

    await removeFromCLoud(course.thumbnail)
    // await removeFromCLoud()
    // await removeFromCLoud()
    await course.deleteOne({id})

    await redis.del(id)

    res.status(200).json({
      status:200,
      course,
      msg:'course successfully deleted'
    })

    
  } catch (err) {
    return next(new ErrorHandler(err.message, 400))
  }
}),

// generate video url 


generateVideoUrl: castAsynError(async (req:Request, res:Response, next:NextFunction) => {
  try {

    const {videoId} = req.body
    const response =  await axios.post(
      `https://www.vdocipher.com/api/videos/${videoId}/otp`,
      {ttl:300},
      {
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json',
          Authorization:`Apisecret ${process.env.VIDEOCIPHER_API_KEY}`
        }
      }
    )

    res.json(response.data)

  } catch (err) {
    return next(new ErrorHandler(err.message, 400))
  }
} )



}