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
const catchAsyncErrors_1 = require("../../middleware/catchAsyncErrors");
const ErrorHandler_1 = require("../../utils/ErrorHandler");
const user_model_1 = __importDefault(require("../../models/user.model"));
const course_model_1 = __importDefault(require("../../models/course.model"));
const notefication_model_1 = __importDefault(require("../../models/notefication.model"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const sendMail_1 = __importDefault(require("../../utils/sendMail"));
const order_service_1 = require("../../services/order.service");
const redis_config_1 = require("../../config/redis.config");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
exports.default = {
    createOrder: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const { courseId, payment_info } = req.body;
            if (payment_info) {
                if ("id" in payment_info) {
                    const paymentIntentId = payment_info.id;
                    const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
                    if (paymentIntent.status !== 'succeeded') {
                        return next(new ErrorHandler_1.ErrorHandler('Payment not authorized', 400));
                    }
                }
            }
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const user = yield user_model_1.default.findById(userId);
            const courseExistInUser = (_b = user === null || user === void 0 ? void 0 : user.courses) === null || _b === void 0 ? void 0 : _b.some((course) => (course === null || course === void 0 ? void 0 : course._id) == courseId);
            if (courseExistInUser) {
                return next(new ErrorHandler_1.ErrorHandler('User already purchased this course', 400));
            }
            const course = yield course_model_1.default.findById(courseId);
            if (!course) {
                return next(new ErrorHandler_1.ErrorHandler('Course not found', 400));
            }
            const data = {
                courseId,
                userId: user === null || user === void 0 ? void 0 : user._id,
                payment_info
            };
            const mailData = {
                order: {
                    _id: course === null || course === void 0 ? void 0 : course._id.toString().slice(0, 6),
                    name: course === null || course === void 0 ? void 0 : course.name,
                    price: course === null || course === void 0 ? void 0 : course.price,
                    date: new Date().toLocaleDateString('en-Us', { year: 'numeric', month: 'long', day: 'numeric' }),
                }
            };
            const html = yield ejs_1.default.renderFile(path_1.default.join(process.cwd(), 'src', 'views', 'mails', 'order-confirmation.ejs'), { order: mailData });
            try {
                if (user) {
                    yield (0, sendMail_1.default)({
                        email: user === null || user === void 0 ? void 0 : user.email,
                        subject: 'Order confirmation',
                        template: 'order-confirmation.ejs',
                        data: mailData
                    });
                }
            }
            catch (err) {
                return next(new ErrorHandler_1.ErrorHandler(err.message + 'ii', 500));
            }
            user === null || user === void 0 ? void 0 : user.courses.push(course === null || course === void 0 ? void 0 : course._id);
            yield redis_config_1.redis.set(req.user._id, JSON.stringify(user));
            yield (user === null || user === void 0 ? void 0 : user.save());
            yield notefication_model_1.default.create({
                userId: user === null || user === void 0 ? void 0 : user._id,
                title: 'New Order',
                message: `You have a new order from ${course === null || course === void 0 ? void 0 : course.name}`
            });
            if (course) {
                course.purchased += 1;
            }
            yield (course === null || course === void 0 ? void 0 : course.save());
            (0, order_service_1.newOrder)(data, res, next);
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message + 'bb', 500));
        }
    })),
    getAllOrders: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            (0, order_service_1.getAllOrdersService)(res);
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
        }
    })),
    sendStripePublishKey: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(200).json({
            publishKey: process.env.STRIPE_PUBLISH_KEY
        });
    })),
    newPayment: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const myPayment = yield stripe.paymentIntents.create({
                amount: req.body.amount,
                currency: 'USD',
                metadata: {
                    company: 'Openhemier',
                },
                automatic_payment_methods: {
                    enabled: true
                }
            });
            res.status(201).json({
                status: 201,
                client_secret: myPayment.client_secret
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 500));
        }
    }))
};
