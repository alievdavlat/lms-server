import { Router } from "express";
import noteficationController from "../../controllers/notefications/notefication.controller";
import { authorizeRole } from "../../controllers/auth/logout.controller";
import isAuthenticated from "../../middleware/auth";
import updateAccessToken from "../../controllers/auth/updatedAccessToken.controller";

const notefications  = Router()

      notefications
            .get('/get-all-notefications',updateAccessToken, isAuthenticated,authorizeRole('admin'), noteficationController.getAllNotification)
            .put('/update-notefications/:id',updateAccessToken, isAuthenticated, authorizeRole('admin'), noteficationController.updateNotefication)
                  

export default notefications