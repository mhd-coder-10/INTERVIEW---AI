import { createContext, useState } from "react";

export const InterviewContext = createContext();

export function InterviewProvider({children}){
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reports, setReports] =  useState([]);

    // const clearInterviewData = ()=>{
    //     setReport(null)
    //     setReports([]);
    // }

    return (
        <InterviewContext.Provider value={{report, setReport, loading, setLoading, reports, setReports}}>
            {children}
        </InterviewContext.Provider>
    )
}