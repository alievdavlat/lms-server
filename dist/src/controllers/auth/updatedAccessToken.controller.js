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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_config_1 = require("../../config/redis.config");
const jwt_1 = require("../../utils/jwt");
const updateAccessToken = (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refresh_Token = req.cookies.refresh_token;
        const decode = jsonwebtoken_1.default.verify(refresh_Token, process.env.REFRESH_TOKEN);
        const message = 'Could not refresh token';
        if (!decode) {
            return next(new ErrorHandler_1.ErrorHandler(message, 400));
        }
        const session = yield redis_config_1.redis.get(decode.id);
        if (!session) {
            return next(new ErrorHandler_1.ErrorHandler('Please login to access to resources', 400));
        }
        const user = JSON.parse(session);
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACESS_TOKEN, {
            expiresIn: '5m'
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
            expiresIn: '3d'
        });
        req.user = user;
        res.cookie('acess_token', accessToken, jwt_1.acessTokenOptions);
        res.cookie('refresh_token', refreshToken, jwt_1.refreshTokenOptions);
        yield redis_config_1.redis.set(user._id, JSON.stringify(user), 'EX', 604800); // 7 day
        next();
    }
    catch (err) {
        return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
    }
}));
exports.default = updateAccessToken;
