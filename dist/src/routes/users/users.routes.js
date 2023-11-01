"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_controller_1 = __importDefault(require("../../controllers/users/user.controller"));
const multer_1 = __importDefault(require("multer"));
const logout_controller_1 = require("../../controllers/auth/logout.controller");
const updatedAccessToken_controller_1 = __importDefault(require("../../controllers/auth/updatedAccessToken.controller"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const userRouter = (0, express_1.Router)();
userRouter
    .get('/me', updatedAccessToken_controller_1.default, auth_1.default, user_controller_1.default.getUserinfo)
    .put('/update-profile', updatedAccessToken_controller_1.default, auth_1.default, user_controller_1.default.updateUserInfo)
    .put('/update-password', updatedAccessToken_controller_1.default, auth_1.default, user_controller_1.default.updatePassword)
    .post('/upload-profile-picture', updatedAccessToken_controller_1.default, auth_1.default, upload.single('avatar'), user_controller_1.default.updateProfilePicture)
    .get('/getall-users', updatedAccessToken_controller_1.default, auth_1.default, (0, logout_controller_1.authorizeRole)('admin'), user_controller_1.default.getAllUser)
    .put('/updateuser-role', updatedAccessToken_controller_1.default, auth_1.default, (0, logout_controller_1.authorizeRole)('admin'), user_controller_1.default.updateUserRole)
    .delete('/delete-user/:id', updatedAccessToken_controller_1.default, auth_1.default, (0, logout_controller_1.authorizeRole)('admin'), user_controller_1.default.deleteUser);
exports.default = userRouter;
