import { Router } from "express";
import orderController from "../../controllers/orders/order.controller";
import isAuthenticated from "../../middleware/auth";
import { authorizeRole } from "../../controllers/auth/logout.controller";
import updateAccessToken from "../../controllers/auth/updatedAccessToken.controller";



const order = Router()



    order 
      .post('/create-order',isAuthenticated, orderController.createOrder)
      .get('/getall-orders',updateAccessToken, isAuthenticated, authorizeRole('admin'), orderController.getAllOrders)
      .get('/payment/stripepublishkey', orderController.sendStripePublishKey)
      .post('/payment', isAuthenticated, orderController.newPayment)

export default order