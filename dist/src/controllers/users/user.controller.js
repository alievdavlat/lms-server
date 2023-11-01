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
const user_service_1 = require("../../services/user.service");
const redis_config_1 = require("../../config/redis.config");
const uploader_1 = require("../../utils/uploader");
exports.default = {
    getUserinfo: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            (0, user_service_1.getUserById)(userId, res);
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
        }
    })),
    updateUserInfo: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            const { name } = req.body;
            const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
            const user = yield user_model_1.default.findById(userId);
            if (name && user) {
                user.name = name;
            }
            yield (user === null || user === void 0 ? void 0 : user.save());
            yield redis_config_1.redis.set(userId, JSON.stringify(user));
            res.status(200).json({
                success: true,
                user
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
        }
    })),
    updatePassword: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d;
        try {
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                return next(new ErrorHandler_1.ErrorHandler("Please enter ol and new password", 400));
            }
            const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
            const user = yield user_model_1.default.findById(userId).select('+password');
            if (user.password === undefined) {
                return next(new ErrorHandler_1.ErrorHandler('Invalid user', 400));
            }
            const isPasswordMatch = yield (user === null || user === void 0 ? void 0 : user.comparePassword(oldPassword));
            if (!isPasswordMatch) {
                return next(new ErrorHandler_1.ErrorHandler('Invalid old password', 400));
            }
            user.password = newPassword;
            yield user.save();
            yield redis_config_1.redis.set((_d = req.user) === null || _d === void 0 ? void 0 : _d._id, JSON.stringify(user));
            res.status(201).json({
                status: 201,
                success: true,
                user,
                msg: 'user password successfully updated'
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
        }
    })),
    updateProfilePicture: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        try {
            const userId = req.user._id;
            const user = yield user_model_1.default.findById(userId);
            if (req.file.fieldname && user) {
                if ((_e = user === null || user === void 0 ? void 0 : user.avatar) === null || _e === void 0 ? void 0 : _e.url) {
                    yield (0, uploader_1.removeFromCLoud)(user === null || user === void 0 ? void 0 : user.avatar.url);
                    const downloadURL = yield (0, uploader_1.uploadToCloud)(req.file, 'avatars');
                    user.avatar.url = downloadURL;
                }
                else {
                    const downloadURL = yield (0, uploader_1.uploadToCloud)(req.file, 'avatars');
                    user.avatar.url = downloadURL;
                }
            }
            user.save();
            yield redis_config_1.redis.set(userId, JSON.stringify(user));
            res.status(200).send({
                status: 200,
                msg: 'image uploaded'
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
        }
    })),
    // only admin 
    getAllUser: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            (0, user_service_1.getAllUsersService)(res);
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
        }
    })),
    updateUserRole: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id, role } = req.body;
            (0, user_service_1.updateUserRoleService)(res, id, role);
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
        }
    })),
    deleteUser: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const user = yield user_model_1.default.findById(id);
            if (!user) {
                return next(new ErrorHandler_1.ErrorHandler('User not found', 404));
            }
            yield (0, uploader_1.removeFromCLoud)(user.avatar.url);
            yield user.deleteOne({ id });
            yield redis_config_1.redis.del(id);
            res.status(200).json({
                status: 200,
                user,
                msg: 'user successfully deleted'
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
        }
    }))
};
