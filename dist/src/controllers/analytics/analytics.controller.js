"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHandler_1 = require("../../utils/ErrorHandler");
const catchAsyncErrors_1 = require("../../middleware/catchAsyncErrors");
const analyticsGenerator_1 = require("../../utils/analyticsGenerator");
const user_model_1 = __importDefault(require("../../models/user.model"));
const course_model_1 = __importDefault(require("../../models/course.model"));
const orders_model_1 = __importDefault(require("../../models/orders.model"));
exports.default = {
    // user data analytcis
    getUsersAnalytics: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield (0, analyticsGenerator_1.generateLast12MonthData)(user_model_1.default);
            res.status(200).json({
                status: 200,
                users,
                msg: 'ok'
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 500));
        }
    })),
    getCoursesAnalytics: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const courses = yield (0, analyticsGenerator_1.generateLast12MonthData)(course_model_1.default);
            res.status(200).json({
                status: 200,
                courses,
                msg: 'ok'
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 500));
        }
    })),
    getOrderAnalytics: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const orders = yield (0, analyticsGenerator_1.generateLast12MonthData)(orders_model_1.default);
            res.status(200).json({
                status: 200,
                orders,
                msg: 'ok'
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 500));
        }
    }))
};
