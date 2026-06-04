const express = require('express');
const interviewRouter = express.Router();
const authMiddelware = require("../middelwere/authMiddleware");
const interviewController = require("../controllers/interviewController");
const upload = require("../middelwere/fileMiddelware");


/**
 * @route POST /api/interview/
 * @description genrate new interview report on the basis of user self description,
 *              resume pdf and job description
 * @access private
 */
interviewRouter.post(
    "/", 
    authMiddelware.authUser, 
    upload.single("resume"),
    interviewController.genrateInterviewController
);


/**
 * @route GET /api/interview/:interviewId
 * @description get interview report by id  
 * @access private
 */
interviewRouter.get(
    "/report/:interviewId",
    authMiddelware.authUser,
    interviewController.getInterviewReportByIdController
);


/**
 * @description get all interview reports of the logedIn user
 * @route GET/api/interview/reports
 * @access private  
 */
interviewRouter.get(
    "/",
    authMiddelware.authUser,
    interviewController.getAllInterviewReportsController
);

/**
 * @route POST/api/interview/resume/PDF
 * @description generate resume pdf on the basis of user resume, self description and content and job description.
 * @access private
 */
interviewRouter.post(
    "/resume/pdf/:interviewReportId/", 
    authMiddelware.authUser,
    interviewController.generateResumePdfController
);

module.exports = interviewRouter;