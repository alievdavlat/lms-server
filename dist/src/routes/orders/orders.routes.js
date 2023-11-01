"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = __importDefault(require("../../controllers/orders/order.controller"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const logout_controller_1 = require("../../controllers/auth/logout.controller");
const updatedAccessToken_controller_1 = __importDefault(require("../../controllers/auth/updatedAccessToken.controller"));
const order = (0, express_1.Router)();
order
    .post('/create-order', auth_1.default, order_controller_1.default.createOrder)
    .get('/getall-orders', updatedAccessToken_controller_1.default, auth_1.default, (0, logout_controller_1.authorizeRole)('admin'), order_controller_1.default.getAllOrders)
    .get('/payment/stripepublishkey', order_controller_1.default.sendStripePublishKey)
    .post('/payment', auth_1.default, order_controller_1.default.newPayment);
exports.default = order;
