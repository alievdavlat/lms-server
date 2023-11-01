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
exports.sendToken = exports.refreshTokenOptions = exports.acessTokenOptions = exports.refreshTokenExpire = exports.acessTokenExpire = exports.createActivationToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_config_1 = require("../config/redis.config");
const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jsonwebtoken_1.default.sign({ user, activationCode }, process.env.ACTIVATION_SECRET_KEY, {
        expiresIn: '5m'
    });
    return {
        token,
        activationCode
    };
};
exports.createActivationToken = createActivationToken;
exports.acessTokenExpire = parseInt(process.env.ACESS_TOKEN_EXPIRE || '300', 10);
exports.refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200', 10);
// cookies options 
exports.acessTokenOptions = {
    expires: new Date(Date.now() + exports.acessTokenExpire * 60 * 60 * 1000),
    maxAge: exports.acessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSizes: 'lax',
};
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + exports.refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: exports.refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSizes: 'lax'
};
const sendToken = (user, statusCode, res) => __awaiter(void 0, void 0, void 0, function* () {
    const acessToken = yield user.signAccessToken();
    const refreshToken = yield user.signrefreshToken();
    // upload to redis 
    redis_config_1.redis.set(user._id, JSON.stringify(user));
    // parse env variables
    if (process.env.NODE_ENV === 'production') {
        exports.acessTokenOptions.secure = true;
    }
    res.cookie('acess_token', acessToken, exports.acessTokenOptions);
    res.cookie('refresh_token', refreshToken, exports.refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        user,
        acessToken
    });
});
exports.sendToken = sendToken;
