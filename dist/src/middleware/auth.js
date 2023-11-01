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
exports.isAuthenticated = void 0;
const catchAsyncErrors_1 = require("./catchAsyncErrors");
const ErrorHandler_1 = require("../utils/ErrorHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_config_1 = require("../config/redis.config");
exports.isAuthenticated = (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.acess_token;
    if (!access_token) {
        return next(new ErrorHandler_1.ErrorHandler('Please login to access to resource', 401));
    }
    const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACESS_TOKEN);
    if (!decoded) {
        return next(new ErrorHandler_1.ErrorHandler(' access token is not valid', 403));
    }
    const user = yield redis_config_1.redis.get(decoded.id);
    if (!user) {
        return next(new ErrorHandler_1.ErrorHandler('Please login to access to resource', 404));
    }
    req.user = JSON.parse(user);
    next();
}));
exports.default = exports.isAuthenticated;
