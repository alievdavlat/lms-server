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
const jwt_1 = require("../../utils/jwt");
const socialAuthController = (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, avatar } = req.body;
        const user = yield user_model_1.default.findOne(({ email }));
        if (!user) {
            const userdata = avatar ? { email, name, avatar } : { email, name };
            const newUser = yield user_model_1.default.create(userdata);
            yield (0, jwt_1.sendToken)(newUser, 201, res);
        }
        else {
            yield (0, jwt_1.sendToken)(user, 200, res);
        }
    }
    catch (err) {
        return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
    }
}));
exports.default = socialAuthController;
