"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notefication_controller_1 = __importDefault(require("../../controllers/notefications/notefication.controller"));
const logout_controller_1 = require("../../controllers/auth/logout.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const updatedAccessToken_controller_1 = __importDefault(require("../../controllers/auth/updatedAccessToken.controller"));
const notefications = (0, express_1.Router)();
notefications
    .get('/get-all-notefications', updatedAccessToken_controller_1.default, auth_1.default, (0, logout_controller_1.authorizeRole)('admin'), notefication_controller_1.default.getAllNotification)
    .put('/update-notefications/:id', updatedAccessToken_controller_1.default, auth_1.default, (0, logout_controller_1.authorizeRole)('admin'), notefication_controller_1.default.updateNotefication);
exports.default = notefications;
