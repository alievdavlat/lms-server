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
const uploader_1 = require("../../utils/uploader");
const course_service_1 = require("../../services/course.service");
const course_model_1 = __importDefault(require("../../models/course.model"));
const redis_config_1 = require("../../config/redis.config");
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const sendMail_1 = __importDefault(require("../../utils/sendMail"));
const notefication_model_1 = __importDefault(require("../../models/notefication.model"));
const axios_1 = __importDefault(require("axios"));
exports.default = {
    uploadCourse: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = req.body;
            if (req === null || req === void 0 ? void 0 : req.file) {
                const thumbnailUrl = yield (0, uploader_1.uploadToCloud)(req === null || req === void 0 ? void 0 : req.file, 'courses');
                const newData = Object.assign(Object.assign({}, data), { thumbnail: thumbnailUrl });
                (0, course_service_1.createCourse)(newData, res, next);
            }
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
        }
    })),
    editCourse: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const body = req.body;
            const thumbnail = req.file.fieldname;
            const { id } = req.params;
            if (!id) {
                return next(new ErrorHandler_1.ErrorHandler('course id required', 400));
            }
            let data;
            const course = yield course_model_1.default.findById(id);
            if (thumbnail) {
                (0, uploader_1.removeFromCLoud)(course.thumbnail);
                const newThumbnailurl = yield (0, uploader_1.uploadToCloud)(req.file, 'courses');
                data = Object.assign(Object.assign({}, body), { thumbnail: newThumbnailurl });
            }
            if (!data) {
                return next(new ErrorHandler_1.ErrorHandler('course not updated plsease try again', 400));
            }
            const updatedCourse = yield course_model_1.default.findByIdAndUpdate(id, { $set: data }, { new: true });
            yield redis_config_1.redis.set(updatedCourse._id, JSON.stringify(updatedCourse), 'EX', 604800);
            res.status(200).json({
                status: 200,
                data: updatedCourse,
                msg: 'updated'
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
        }
    })),
    getAllCourse: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const isCashExist = yield redis_config_1.redis.get('allCourses');
            const courses = yield course_model_1.default.find().select('-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links');
            if (courses) {
                yield redis_config_1.redis.set('allCourses', JSON.stringify(courses));
                res.status(200).json({
                    status: 200,
                    data: courses,
                    msg: 'ok'
                });
            }
            else {
                const course = JSON.parse(isCashExist);
                res.status(200).json({
                    status: 200,
                    data: course,
                    msg: 'ok'
                });
            }
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
        }
    })),
    getSingleCourse: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                return next(new ErrorHandler_1.ErrorHandler('course id required', 400));
            }
            const isCashExist = yield redis_config_1.redis.get(id);
            if (isCashExist) {
                const course = JSON.parse(isCashExist);
                res.status(200).json({
                    status: 200,
                    data: course,
                    msg: 'ok'
                });
            }
            else {
                const course = yield course_model_1.default.findById(id).select('-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links');
                yield redis_config_1.redis.set(id, JSON.stringify(course), 'EX', 604800); //7 days
                res.status(200).json({
                    status: 200,
                    data: course,
                    msg: 'ok'
                });
            }
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
        }
    })),
    // only for valid users 
    getCourseByUser: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const userCourseLits = (_a = req.user) === null || _a === void 0 ? void 0 : _a.courses;
            const courseId = req.params.id;
            const courseExist = userCourseLits === null || userCourseLits === void 0 ? void 0 : userCourseLits.find((course) => (course === null || course === void 0 ? void 0 : course._id) == courseId);
            if (!courseExist) {
                return next(new ErrorHandler_1.ErrorHandler('you cannot access this course', 400));
            }
            const course = yield course_model_1.default.findById(courseId);
            const content = course === null || course === void 0 ? void 0 : course.courseData;
            res.status(200).json({
                status: 200,
                content,
                msg: "Success"
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
        }
    })),
    // course questions  
    addQuestion: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            const { question, courseId, contentId } = req.body;
            const course = yield course_model_1.default.findById(courseId);
            if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
                return next(new ErrorHandler_1.ErrorHandler('Invalid content id', 400));
            }
            const courseContent = course === null || course === void 0 ? void 0 : course.courseData.find((item) => item === null || item === void 0 ? void 0 : item._id.equals(contentId));
            if (!courseContent) {
                return next(new ErrorHandler_1.ErrorHandler('Invalid content id', 400));
            }
            const newQuestion = {
                user: req.user,
                question,
                questionReplies: []
            };
            courseContent.questions.push(newQuestion);
            yield notefication_model_1.default.create({
                userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
                title: 'New Question Recived',
                message: `You have a new Question in ${courseContent === null || courseContent === void 0 ? void 0 : courseContent.title}`
            });
            yield (course === null || course === void 0 ? void 0 : course.save());
            yield redis_config_1.redis.set(course._id, JSON.stringify(course), 'EX', 604800);
            res.status(200).json({
                status: 200,
                course,
                msg: 'ok'
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 500));
        }
    })),
    addAnswerQuestion: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d, _e, _f;
        try {
            const { answer, courseId, contentId, questionId } = req.body;
            const course = yield course_model_1.default.findById(courseId);
            if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
                return next(new ErrorHandler_1.ErrorHandler('Invalid content id', 400));
            }
            const courseContent = course === null || course === void 0 ? void 0 : course.courseData.find((item) => item === null || item === void 0 ? void 0 : item._id.equals(contentId));
            if (!courseContent) {
                return next(new ErrorHandler_1.ErrorHandler('Invalid content id', 400));
            }
            const question = courseContent === null || courseContent === void 0 ? void 0 : courseContent.questions.find((item) => item === null || item === void 0 ? void 0 : item._id.equals(questionId));
            if (!question) {
                return next(new ErrorHandler_1.ErrorHandler('Invalid question id', 400));
            }
            const newAnswer = {
                user: req.user,
                answer
            };
            question.questionReplies.push(newAnswer);
            yield (course === null || course === void 0 ? void 0 : course.save());
            yield redis_config_1.redis.set(course._id, JSON.stringify(course), 'EX', 604800);
            if (((_c = req.user) === null || _c === void 0 ? void 0 : _c._id) === question.user._id) {
                yield notefication_model_1.default.create({
                    user: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id,
                    title: 'New Question Reply Received',
                    message: `You have a new  question reply in  ${courseContent.title}`
                });
            }
            else {
                const data = {
                    name: (_e = question === null || question === void 0 ? void 0 : question.user) === null || _e === void 0 ? void 0 : _e.name,
                    title: courseContent === null || courseContent === void 0 ? void 0 : courseContent.title
                };
                const html = yield ejs_1.default.renderFile(path_1.default.join(process.cwd(), 'src', 'views', 'mails', 'question-reply.ejs'), data);
                try {
                    yield (0, sendMail_1.default)({
                        email: (_f = question === null || question === void 0 ? void 0 : question.user) === null || _f === void 0 ? void 0 : _f.email,
                        subject: 'Question Reply',
                        template: 'question-reply.ejs',
                        data
                    });
                }
                catch (err) {
                    return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
                }
            }
            res.status(200).json({
                status: 200,
                course,
                msg: 'ok'
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 500));
        }
    })),
    addReview: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _g, _h, _j;
        try {
            const userCourseLits = (_g = req.user) === null || _g === void 0 ? void 0 : _g.courses;
            const courseId = req.params.id;
            const courseExist = userCourseLits.some((course) => course._id == courseId);
            if (!courseExist) {
                return next(new ErrorHandler_1.ErrorHandler('you cannot access to this course', 400));
            }
            const course = yield course_model_1.default.findById(courseId);
            const { review, rating } = req.body;
            const reviewData = {
                user: req.user,
                comment: review,
                rating
            };
            course.reviews.push(reviewData);
            let avg = 0;
            (_h = course === null || course === void 0 ? void 0 : course.reviews) === null || _h === void 0 ? void 0 : _h.forEach((rev) => {
                avg += rev.rating;
            });
            if (course) {
                course.ratings = avg / course.reviews.length;
            }
            yield (course === null || course === void 0 ? void 0 : course.save());
            yield redis_config_1.redis.set(course._id, JSON.stringify(course), 'EX', 604800);
            //  notification create 
            yield notefication_model_1.default.create({
                user: req.user._id,
                title: 'New Review Recived',
                message: `${(_j = req.user) === null || _j === void 0 ? void 0 : _j.name} has given a review in ${course === null || course === void 0 ? void 0 : course.name}`,
            });
            res.status(200).json({
                status: 200,
                course,
                msg: 'ok'
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 500));
        }
    })),
    addReplyReview: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _k, _l;
        try {
            const { comment, courseId, reviewId } = req.body;
            const course = yield course_model_1.default.findById(courseId);
            if (!course) {
                return next(new ErrorHandler_1.ErrorHandler('Course not found', 494));
            }
            const review = (_k = course === null || course === void 0 ? void 0 : course.reviews) === null || _k === void 0 ? void 0 : _k.find((rev) => rev._id == reviewId);
            if (!review) {
                return next(new ErrorHandler_1.ErrorHandler('Reviw not found', 404));
            }
            const replyData = {
                user: req.user,
                comment,
            };
            if (!review.commentReplies) {
                review.commentReplies = [];
            }
            (_l = review === null || review === void 0 ? void 0 : review.commentReplies) === null || _l === void 0 ? void 0 : _l.push(replyData);
            yield (course === null || course === void 0 ? void 0 : course.save());
            yield redis_config_1.redis.set(course._id, JSON.stringify(course), 'EX', 604800);
            const date = {
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            res.status(200).json({
                status: 200,
                date,
                msg: "ok"
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 500));
        }
    })),
    //for admin
    getAllCourses: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            (0, course_service_1.getAllCoursesService)(res);
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
        }
    })),
    deleteCourse: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const course = yield course_model_1.default.findById(id);
            console.log(course);
            if (!course) {
                return next(new ErrorHandler_1.ErrorHandler('Course not found', 404));
            }
            yield (0, uploader_1.removeFromCLoud)(course.thumbnail);
            // await removeFromCLoud()
            // await removeFromCLoud()
            yield course.deleteOne({ id });
            yield redis_config_1.redis.del(id);
            res.status(200).json({
                status: 200,
                course,
                msg: 'course successfully deleted'
            });
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
        }
    })),
    // generate video url 
    generateVideoUrl: (0, catchAsyncErrors_1.castAsynError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { videoId } = req.body;
            const response = yield axios_1.default.post(`https://www.vdocipher.com/api/videos/${videoId}/otp`, { ttl: 300 }, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Apisecret ${process.env.VIDEOCIPHER_API_KEY}`
                }
            });
            res.json(response.data);
        }
        catch (err) {
            return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
        }
    }))
};
