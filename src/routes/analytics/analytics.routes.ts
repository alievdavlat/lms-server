import { Router } from "express";
import analyticsController from "../../controllers/analytics/analytics.controller";
import isAuthenticated from "../../middleware/auth";
import { authorizeRole } from "../../controllers/auth/logout.controller";



const analytics = Router()

      analytics
          .get('/user-analytics',isAuthenticated, authorizeRole('admin'), analyticsController.getUsersAnalytics)
          .get('/courses-analytics',isAuthenticated, authorizeRole('admin'), analyticsController.getCoursesAnalytics)
          .get('/orders-analytics',isAuthenticated, authorizeRole('admin'), analyticsController.getOrderAnalytics)


export default analytics