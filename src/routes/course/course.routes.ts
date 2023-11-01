import { Router } from "express";
import courseController from "../../controllers/course/course.controller";
import upload from "../../utils/multer";
import isAuthenticated from "../../middleware/auth";
import { authorizeRole } from "../../controllers/auth/logout.controller";
import updateAccessToken from "../../controllers/auth/updatedAccessToken.controller";


const courseRouter = Router()

const cpUpload = upload.fields([{ name: 'demoUrl'}, { name: 'thumbnail' }, { name: 'videoUrl' }])
      courseRouter
            .post('/create-course' ,updateAccessToken, isAuthenticated, authorizeRole('admin'),upload.single('thumbnail') , courseController.uploadCourse)
            .put('/edit-course/:id',updateAccessToken,isAuthenticated, authorizeRole('admin'),upload.single('thumbnail'), courseController.editCourse)
            .get('/get-course/:id', courseController.getSingleCourse)
            .get('/get-courses', courseController.getAllCourse)
            .get('/get-course-content/:id',updateAccessToken,isAuthenticated,  courseController.getCourseByUser)
            .put('/add-question',updateAccessToken,isAuthenticated,  courseController.addQuestion)
            .put('/add-answer',updateAccessToken,isAuthenticated,  courseController.addAnswerQuestion)
            .put('/add-review/:id',updateAccessToken,isAuthenticated,  courseController.addReview)
            .put('/add-reply-review',updateAccessToken,isAuthenticated,authorizeRole('admin') , courseController.addReplyReview)
            .get('/get-courses-for-admin',updateAccessToken, isAuthenticated,authorizeRole('admin'), courseController.getAllCourses )
            .delete('/delete-course/:id',updateAccessToken, isAuthenticated, authorizeRole('admin'), courseController.deleteCourse)
            .post('/getVdoCipherOTP', courseController.generateVideoUrl)
            


export default courseRouter