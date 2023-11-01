"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const layout_controller_1 = __importDefault(require("../../controllers/layout/layout.controller"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const logout_controller_1 = require("../../controllers/auth/logout.controller");
const multer_1 = __importDefault(require("../../utils/multer"));
const updatedAccessToken_controller_1 = __importDefault(require("../../controllers/auth/updatedAccessToken.controller"));
const layout = (0, express_1.Router)();
layout
    .post('/create-layout', updatedAccessToken_controller_1.default, auth_1.default, (0, logout_controller_1.authorizeRole)('admin'), multer_1.default.single('bannerImage'), layout_controller_1.default.createLayout)
    .put('/update-layout', updatedAccessToken_controller_1.default, auth_1.default, (0, logout_controller_1.authorizeRole)('admin'), multer_1.default.single('bannerImage'), layout_controller_1.default.editlayout)
    .get('/get-layout/:type', layout_controller_1.default.getLayoutByType);
exports.default = layout;
