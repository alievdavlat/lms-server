"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = __importDefault(require("../../controllers/analytics/analytics.controller"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const logout_controller_1 = require("../../controllers/auth/logout.controller");
const analytics = (0, express_1.Router)();
analytics
    .get('/user-analytics', auth_1.default, (0, logout_controller_1.authorizeRole)('admin'), analytics_controller_1.default.getUsersAnalytics)
    .get('/courses-analytics', auth_1.default, (0, logout_controller_1.authorizeRole)('admin'), analytics_controller_1.default.getCoursesAnalytics)
    .get('/orders-analytics', auth_1.default, (0, logout_controller_1.authorizeRole)('admin'), analytics_controller_1.default.getOrderAnalytics);
exports.default = analytics;
