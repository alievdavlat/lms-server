"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_controller_1 = __importDefault(require("../../controllers/course/course.controller"));
const multer_1 = __importDefault(require("../../utils/multer"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const logout_controller_1 = require("../../controllers/auth/logout.controller");
const updatedAccessToken_controller_1 = __importDefault(require("../../controllers/auth/updatedAccessToken.controller"));
const courseRouter = (0, express_1.Router)();
const cpUpload = multer_1.default.fields([{ name: 'demoUrl' }, { name: 'thumbnail' }, { name: 'videoUrl' }]);
courseRouter
    .post('/create-course', updatedAccessToken_controller_1.default, auth_1.default, (0, logout_controller_1.authorizeRole)('admin'), multer_1.default.single('thumbnail'), course_controller_1.default.uploadCourse)
    .put('/edit-course/:id', updatedAccessToken_controller_1.default, auth_1.default, (0, logout_controller_1.authorizeRole)('admin'), multer_1.default.single('thumbnail'), course_controller_1.default.editCourse)
    .get('/get-course/:id', course_controller_1.default.getSingleCourse)
    .get('/get-courses', course_controller_1.default.getAllCourse)
    .get('/get-course-content/:id', updatedAccessToken_controller_1.default, auth_1.default, course_controller_1.default.getCourseByUser)
    .put('/add-question', updatedAccessToken_controller_1.default, auth_1.default, course_controller_1.default.addQuestion)
    .put('/add-answer', updatedAccessToken_controller_1.default, auth_1.default, course_controller_1.default.addAnswerQuestion)
    .put('/add-review/:id', updatedAccessToken_controller_1.default, auth_1.default, course_controller_1.default.addReview)
    .put('/add-reply-review', updatedAccessToken_controller_1.default, auth_1.default, (0, logout_controller_1.authorizeRole)('admin'), course_controller_1.default.addReplyReview)
    .get('/get-courses-for-admin', updatedAccessToken_controller_1.default, auth_1.default, (0, logout_controller_1.authorizeRole)('admin'), course_controller_1.default.getAllCourses)
    .delete('/delete-course/:id', updatedAccessToken_controller_1.default, auth_1.default, (0, logout_controller_1.authorizeRole)('admin'), course_controller_1.default.deleteCourse)
    .post('/getVdoCipherOTP', course_controller_1.default.generateVideoUrl);
exports.default = courseRouter;
