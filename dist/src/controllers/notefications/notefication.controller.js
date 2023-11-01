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
const notefication_model_1 = __importDefault(require("../../models/notefication.model"));
const ErrorHandler_1 = require("../../utils/ErrorHandler");
const catchAsyncErrors_1 = require("../../middleware/catchAsyncErrors");
const node_cron_1 = __importDefault(require("node-cron"));
exports.default = {
    getAllNotification: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const notifications = yield notefication_model_1.default.find().sort({
                createdAt: -1,
            });
            res.status(200).json({
                status: 200,
                notifications,
                msg: "ok",
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 500));
        }
    })),
    updateNotefication: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const notification = yield notefication_model_1.default.findById(req.params.id);
            if (!notification) {
                return next(new ErrorHandler_1.ErrorHandler("Notefication not found", 400));
            }
            else {
                notification.status
                    ? (notification.status = "read")
                    : notification.status;
            }
            yield notification.save();
            const notefications = yield notefication_model_1.default.find().sort({
                createdAt: -1,
            });
            res.status(200).json({
                status: 200,
                notefications,
                msg: "ok",
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 500));
        }
    })),
};
node_cron_1.default.schedule("0 0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    yield notefication_model_1.default.deleteMany({ status: 'read', createdAt: { $lt: thirtyDaysAgo } });
    console.log('Deleted read notifications');
}));
