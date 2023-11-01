import NoteficationModel from "../../models/notefication.model";
import { Response, Request, NextFunction } from "express";
import { ErrorHandler } from "../../utils/ErrorHandler";
import { castAsynError } from "../../middleware/catchAsyncErrors";
import cron from 'node-cron'


export default {
  getAllNotification: castAsynError(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const notifications = await NoteficationModel.find().sort({
          createdAt: -1,
        });
        
        res.status(200).json({
          status: 200,
          notifications,
          msg: "ok",
        });


      } catch (err) {
        return next(new ErrorHandler(err.message, 500));
      }
    }
  ),

  updateNotefication: castAsynError( async (req: Request, res: Response, next: NextFunction) => {
      try {
        const notification = await NoteficationModel.findById(req.params.id);

        if (!notification) {
          return next(new ErrorHandler("Notefication not found", 400));
        } else {
          notification.status
            ? (notification.status = "read")
            : notification.status;
        }

        await notification.save();

        const notefications = await NoteficationModel.find().sort({
          createdAt: -1,
        });


        res.status(200).json({
          status: 200,
          notefications,
          msg: "ok",
        });

      } catch (err) {
        return next(new ErrorHandler(err.message, 500));
      }
    }
  ),

};


cron.schedule("0 0 0 * * *", async() => {
  const thirtyDaysAgo  = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  await NoteficationModel.deleteMany({status:'read', createdAt: {$lt:thirtyDaysAgo}})

  console.log('Deleted read notifications');
  
});



