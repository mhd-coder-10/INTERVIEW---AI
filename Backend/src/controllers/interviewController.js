const pdfParse = require("pdf-parse");
const {generateInterviewReport, generateResumePdf} = require("../services/aiServices");
const interviewReportModel = require("../models/interviewReportModel");


/** 
 * * @description controller to Generate Interview Report based on Resume, Self Description and Job Description
 */
async function genrateInterviewController(req, res) {

    try {
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
        const { selfDescription, jobDescription } = req.body;

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id || req.user._id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        });

        res.status(201).json({
            message: "Interview Report Generated Successfully",
            interviewReport
        });

    } catch (err) {
        // console.error( "Generate Interview Controller Error:", err);
        // console.error(JSON.stringify(err, null, 2));
        
        console.dir(error, { depth: null });


        // Gemini Quota Error
        if (
            err?.status === 429 ||
            err?.message?.includes("quota") ||
            err?.message?.includes("RESOURCE_EXHAUSTED")
        ) {
            return res.status(429).json({
                message:
                    "Gemini API quota exceeded. Please try again later."
            });
        }

        return res.status(500).json({
            message:
                err.message ||
                "Failed to generate interview report"
        });
    }

}

/**
 * * @description controller to get Interview Report by Id
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId, user: req.user.id || req.user._id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview Report Not Found"
            });
        }

        res.status(200).json({
            message: "Interview Report Found",
            interviewReport
        });
    } catch (err) {
        console.error(
            "Get Interview Report Error:",
            err
        );

        return res.status(500).json({
            message:
                err.message ||
                "Failed to fetch interview report"
        });
    }

}

/**
 * * @description controller to get all interview reports of the logedIn user
 */
async function getAllInterviewReportsController(req, res) {

    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id})
        .sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan "); // Exclude sensitive content for listing

        if (!interviewReports || interviewReports.length === 0) {
            return res.status(200).json({
                message: "No Interview Reports Found",
                interviewReports: interviewReports || []
            });
        }

        res.status(200).json({
            message: "Interview Reports Found",
            interviewReports
        });
        
    } catch (err) {
        console.error(
            "Get All Reports Error:",
            err
        );

        return res.status(500).json({
            message:
                err.message ||
                "Failed to fetch all interview reports"
        });
    }
}


/**
 * @description controller to Generate Resume PDF based on user Resume, Self Description, Job Description
 */
async function generateResumePdfController(req, res){

    const {interviewReportId} = req.params;
    
    const interviewReport = await interviewReportModel.findById(interviewReportId);
    
    if(!interviewReport) {
        return res.status(404).json({
            message : "Interview report not found."
        })
    }

    const {resume, selfDescription, jobDescription} = interviewReport;

    const pdfBuffer = await generateResumePdf({resume, selfDescription, jobDescription});

    res.set({
        "Content-Type": "application/pdf",  
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    });

    res.send(pdfBuffer);
}


module.exports = {
    genrateInterviewController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}