import axios from "axios";

const interview_Api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials : true,
})


/**
 * * @description service function to call backend api to generate interview report
 */
export const generateInterviewReport = async({jobDescription, selfDescription, resumeFile}) => {
    try {
        const formData = new FormData();    
        formData.append("jobDescription", jobDescription);
        formData.append("selfDescription", selfDescription);
        if(resumeFile){
            formData.append("resume", resumeFile);
        }

        const response = await interview_Api.post("/api/interview/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;

    } catch(err){
        console.log("Error generating interview report (from interviewApi) :", err);
        console.error(
            err.response?.data?.message ||
            err.message
        );

        throw err; // IMPORTANT
    }

}
    
/**
 * * @description service function to call backend api to get interview report by id
 */
export const getInterviewReportById = async (interviewID) => {     
    try {
        const response = await interview_Api.get(`/api/interview/report/${interviewID}`);
        return response.data;   

    } catch(err){
        console.log("Error fetching interview report (from interviewApi) :", err);
        console.error(
            err.response?.data?.message ||
            err.message
        );

        throw err; // IMPORTANT
    }
}

/**
 * @description service function to call backend api to get all interview reports of the logedIn user
 */
export const getAllInterviewReports = async () => {
    try {
        const response = await interview_Api.get("/api/interview/");
        return response.data;
    } catch(err){
        console.log("Error fetching all interview reports (from interviewApi) :", err);
        console.error(
            err.response?.data?.message ||
            err.message
        );

        throw err; // IMPORTANT
    }
}

/**
 * @description Geerate/ download Resume PDF based user's resume, JD, SD
 */
export const generateResumePdf = async({interviewReportID})=>{
    const response = await interview_Api.post(
        `/api/interview/resume/pdf/${interviewReportID}`,
        null,
        {responseType : "blob"}
    );
    return response.data;
}