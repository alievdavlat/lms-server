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
const layout_model_1 = __importDefault(require("../../models/layout.model"));
const uploader_1 = require("../../utils/uploader");
exports.default = {
    createLayout: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { type } = req.body;
            const eachTypeExist = yield layout_model_1.default.findOne({ type });
            if (eachTypeExist) {
                return next(new ErrorHandler_1.ErrorHandler(`${type}  already exist`, 400));
            }
            if (type === 'Banner') {
                const { title, subtitle } = req.body;
                const bannerImage = yield (0, uploader_1.uploadToCloud)(req.file, 'layout');
                yield layout_model_1.default.create({ type: 'Banner', banner: { image: bannerImage, title, subtitle } });
            }
            if (type === 'FAQ') {
                const { faq } = req.body;
                const FaqItems = yield Promise.all(faq.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                    return {
                        question: item.question,
                        answer: item.answer
                    };
                })));
                yield layout_model_1.default.create({ type: 'FAQ', faq: FaqItems });
            }
            if (type === 'Categories') {
                const { categories } = req.body;
                const CategoriesItems = yield Promise.all(categories.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                    return {
                        title: item.title
                    };
                })));
                yield layout_model_1.default.create({ type: 'Categories', categories: CategoriesItems });
            }
            res.status(201).json({
                status: 201,
                msg: 'Layout created successfully'
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 500));
        }
    })),
    editlayout: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const { type } = req.body;
            if (type === 'Banner') {
                const bannerData = yield layout_model_1.default.findOne({ type: 'Banner' });
                if (((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.fieldname) === 'bannerImage') {
                    if ((_b = bannerData === null || bannerData === void 0 ? void 0 : bannerData.banner) === null || _b === void 0 ? void 0 : _b.image) {
                        yield (0, uploader_1.removeFromCLoud)(bannerData.banner.image);
                    }
                    const bannerImage = yield (0, uploader_1.uploadToCloud)(req.file, 'layout');
                    yield layout_model_1.default.findByIdAndUpdate(bannerData._id, { banner: Object.assign({ image: bannerImage }, req.body) });
                }
                else {
                    yield layout_model_1.default.findByIdAndUpdate(bannerData._id, { banner: Object.assign({ image: bannerData.banner.image }, req.body) });
                }
            }
            if (type === 'FAQ') {
                const { faq } = req.body;
                const faqData = yield layout_model_1.default.findOne({ type: 'FAQ' });
                const FaqItems = yield Promise.all(faq.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                    return {
                        question: item.question,
                        answer: item.answer
                    };
                })));
                yield layout_model_1.default.findByIdAndUpdate(faqData._id, { faq: FaqItems });
            }
            if (type === 'Categories') {
                const { categories } = req.body;
                const categoriesData = yield layout_model_1.default.findOne({ type: 'Categories' });
                const CategoriesItems = yield Promise.all(categories.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                    return {
                        title: item.title
                    };
                })));
                yield layout_model_1.default.findByIdAndUpdate(categoriesData._id, { categories: CategoriesItems });
            }
            res.status(201).json({
                status: 201,
                msg: 'Layout updated successfully'
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 500));
        }
    })),
    getLayoutByType: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { type } = req.params;
            const layout = yield layout_model_1.default.findOne({ type });
            res.status(200).json({
                status: 200,
                layout,
                msg: 'ok'
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 500));
        }
    }))
};
