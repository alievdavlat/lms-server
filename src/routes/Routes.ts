import { Router } from "express";
import userRouter from "./users/users.routes";
import authRouter from "./auth.routes";
import courseRouter from "./course/course.routes";
import order from "./orders/orders.routes";
import notefications from "./notefications/notefications.routes";
import analytics from "./analytics/analytics.routes";
import layout from "./Layout/layout.routes";


const MainRouter = Router()



export default MainRouter.use([
  authRouter,
  userRouter,
  courseRouter,
  order,
  notefications,
  analytics,
  layout
])