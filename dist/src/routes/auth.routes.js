"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const register_controller_1 = __importDefault(require("../controllers/auth/register.controller"));
const activateUser_controller_1 = __importDefault(require("../controllers/auth/activateUser.controller"));
const login_controller_1 = __importDefault(require("../controllers/auth/login.controller"));
const logout_controller_1 = require("../controllers/auth/logout.controller");
const auth_1 = __importDefault(require("../middleware/auth"));
const updatedAccessToken_controller_1 = __importDefault(require("../controllers/auth/updatedAccessToken.controller"));
const socialAuth_1 = __importDefault(require("../controllers/auth/socialAuth"));
const authRouter = (0, express_1.Router)();
authRouter
    .post('/register', register_controller_1.default)
    .post('/activate-user', activateUser_controller_1.default)
    .post('/login', login_controller_1.default)
    .get('/logout', auth_1.default, logout_controller_1.logOutController)
    .get('/refreshtoken', updatedAccessToken_controller_1.default)
    .post('/socialAuth', socialAuth_1.default);
exports.default = authRouter;
