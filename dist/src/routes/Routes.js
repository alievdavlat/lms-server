"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_routes_1 = __importDefault(require("./users/users.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const course_routes_1 = __importDefault(require("./course/course.routes"));
const orders_routes_1 = __importDefault(require("./orders/orders.routes"));
const notefications_routes_1 = __importDefault(require("./notefications/notefications.routes"));
const analytics_routes_1 = __importDefault(require("./analytics/analytics.routes"));
const layout_routes_1 = __importDefault(require("./Layout/layout.routes"));
const MainRouter = (0, express_1.Router)();
exports.default = MainRouter.use([
    auth_routes_1.default,
    users_routes_1.default,
    course_routes_1.default,
    orders_routes_1.default,
    notefications_routes_1.default,
    analytics_routes_1.default,
    layout_routes_1.default
]);
