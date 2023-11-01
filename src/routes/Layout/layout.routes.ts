import { Router } from "express";
import layoutController from "../../controllers/layout/layout.controller";
import isAuthenticated from "../../middleware/auth";
import { authorizeRole } from "../../controllers/auth/logout.controller";
import upload from "../../utils/multer";
import updateAccessToken from "../../controllers/auth/updatedAccessToken.controller";


const layout = Router()


      layout
          .post('/create-layout',updateAccessToken,isAuthenticated, authorizeRole('admin'),upload.single('bannerImage'), layoutController.createLayout)
          .put('/update-layout',updateAccessToken,isAuthenticated, authorizeRole('admin'),upload.single('bannerImage'), layoutController.editlayout)
          .get('/get-layout/:type', layoutController.getLayoutByType)




export default layout