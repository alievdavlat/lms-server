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
const user_model_1 = __importDefault(require("../../models/user.model"));
const ErrorHandler_1 = require("../../utils/ErrorHandler");
const catchAsyncErrors_1 = require("../../middleware/catchAsyncErrors");
const jwt_1 = require("../../utils/jwt");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const sendMail_1 = __importDefault(require("../../utils/sendMail"));
const registerUserController = (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const isEmailExist = yield user_model_1.default.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler_1.ErrorHandler('Email already exist', 400));
        }
        const user = {
            name,
            email,
            password
        };
        const activationToken = (0, jwt_1.createActivationToken)(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode };
        const html = yield ejs_1.default.renderFile(path_1.default.join(process.cwd(), 'src', 'views', 'mails', 'activation-mail.ejs'), data);
        try {
            yield (0, sendMail_1.default)({
                email: user.email,
                subject: 'Activate your account',
                template: "activation-mail.ejs",
                data,
            });
            res.status(201).json({
                success: true,
                message: `Please  check you email: ${user.email} to activate your account!`,
                activationToken: activationToken.token
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
        }
    }
    catch (err) {
        return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
    }
}));
exports.default = registerUserController;
