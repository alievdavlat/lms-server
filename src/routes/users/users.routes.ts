import { Router } from "express";
import isAuthenticated from "../../middleware/auth";
import userController from "../../controllers/users/user.controller";
import multer from "multer";
import { authorizeRole } from "../../controllers/auth/logout.controller";
import updateAccessToken from "../../controllers/auth/updatedAccessToken.controller";



const upload = multer({ storage: multer.memoryStorage() });

const userRouter  = Router()


            userRouter
                .get('/me',updateAccessToken, isAuthenticated,  userController.getUserinfo)
                .put('/update-profile',updateAccessToken,isAuthenticated, userController.updateUserInfo)
                .put('/update-password', updateAccessToken,isAuthenticated, userController.updatePassword)
                .post('/upload-profile-picture',updateAccessToken, isAuthenticated,upload.single('avatar'), userController.updateProfilePicture)
                .get('/getall-users',updateAccessToken, isAuthenticated, authorizeRole('admin'), userController.getAllUser)
                .put('/updateuser-role', updateAccessToken,isAuthenticated, authorizeRole('admin'), userController.updateUserRole)
                .delete('/delete-user/:id', updateAccessToken,isAuthenticated, authorizeRole('admin'), userController.deleteUser)



export default userRouter