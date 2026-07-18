import {
    generateInterviewReport,
    getInterviewReportById,
    getAllInterviewReports,
    generateResumePdf
} from "../services/interviewApi";

import { useContext, useEffect } from "react";
import { InterviewContext } from "../InterviewContext";
import { useParams } from "react-router";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams();

    if (!context) {
        throw new Error("useInterview must be used within InterviewProvider");
    }

    const { report, setReport, loading, setLoading, reports, setReports } = context;

    const generateReport = async ({ jobDescription, selfDescription, reesumeFile }) => {
        setLoading(true);
        let response = null;
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, reesumeFile });
            setReport(response.interviewReport);
        } catch (e) {
            console.log("Error generating interview report (from useInterview) :", e);
        } finally {
            setLoading(false);
        }

        return response.interviewReport;
    }

    const getReportById = async (reportId) => {
        setLoading(true);
        let response = null;
        try {
            response = await getInterviewReportById(reportId);
            setReport(response.interviewReport);
        } catch (err) {
            console.log("Error fetching interview report by id (from useInterview) :", err);
        } finally {
            setLoading(false);
        }

        return response.interviewReport;
    }

    // const getReports = async()=>{
    //     setLoading(true);
    //     let response = null;
    //     try {
    //         response = await getAllInterviewReports();
    //         setReports(response.interviewReports);
    //     } catch(err){
    //         console.log("Error fetching all interview reports(from useInterview) :", err);
    //     } finally{
    //         setLoading(false);
    //     }
    //     return response.interviewReports;
    // }

    const getReports = async () => {
        setLoading(true);
        try {
            const response = await getAllInterviewReports();
            setReports(response?.interviewReports || []);
            return response?.interviewReports || [];
        }
        catch (err) {
            console.log(
                "Error fetching all interview reports(from useInterview) :",
                err
            );

            setReports([]);

            return [];
        }
        finally {
            setLoading(false);
        }
    }

    const getResumePdf = async (interviewReportID) => {
        setLoading(true);
        let response = null;
        try {
            response = await generateResumePdf({ interviewReportID });
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pd" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `resume_${interviewReportID}.pdf`);
            document.body.appendChild(link);
            link.click();

        } catch (err) {
            console.log("Error during generate Resume PDF (from useInterview) :", err);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);   // This will set the 'report' in context, which can be used by the component to display the report details
        } else {
            getReports(); // This will set the 'reports' in context, which can be used by the component to display the list of reports for the user
        }
    }, [interviewId]);

    return {
        report,
        loading,
        setLoading,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf
    }
}