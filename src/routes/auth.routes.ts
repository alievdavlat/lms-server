import { Router } from "express";
import registerUserController from "../controllers/auth/register.controller";
import activateUsersController from "../controllers/auth/activateUser.controller";
import LoginController from "../controllers/auth/login.controller";
import {authorizeRole, logOutController} from "../controllers/auth/logout.controller";
import isAuthenticated from "../middleware/auth";
import updateAccessToken from "../controllers/auth/updatedAccessToken.controller";
import socialAuthController from "../controllers/auth/socialAuth";


const authRouter = Router()

      authRouter
            .post('/register', registerUserController)
            .post('/activate-user', activateUsersController)
            .post('/login',  LoginController)
            .get('/logout', isAuthenticated,  logOutController)
            .get('/refreshtoken', updateAccessToken)      
            .post('/socialAuth', socialAuthController)


export default authRouter