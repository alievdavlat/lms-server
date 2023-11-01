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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.logOutController = void 0;
const catchAsyncErrors_1 = require("../../middleware/catchAsyncErrors");
const ErrorHandler_1 = require("../../utils/ErrorHandler");
const redis_config_1 = require("../../config/redis.config");
const logOutController = (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        res.cookie('acess_token', '', { maxAge: 1 });
        res.cookie('refresh_token', '', { maxAge: 1 });
        redis_config_1.redis.del((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        res.status(200).json({
            success: true,
            message: 'Logged out successfully '
        });
    }
    catch (err) {
        return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
    }
}));
exports.logOutController = logOutController;
//validate user roles 
const authorizeRole = (...roles) => {
    return (req, res, next) => {
        var _a;
        if (!roles.includes(req.user.role || '')) {
            return next(new ErrorHandler_1.ErrorHandler(`Role ${(_a = req.user) === null || _a === void 0 ? void 0 : _a.role} is not allowed to access this resource`, 403));
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
