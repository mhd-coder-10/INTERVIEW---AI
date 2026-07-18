import React, {useState, useRef} from 'react';
import '../style/Home.scss';
import Header from "./Header.jsx"
import { useInterview } from '../hooks/useInterview.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { useNavigate } from 'react-router';
import { generateInterviewReport } from '../services/interviewApi.js';
import { toast } from 'react-toastify';

const Home = () => {
    const {user} = useAuth();
    const {report, loading, setLoading, reports } = useInterview();
    const [selfDescription, setSelfDescription] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const resumeInputRef = useRef();

    const navigate = useNavigate();

    const handleGenerateReportSubmit = async ()=>{
        setLoading(true);
        try {
            const resumeFile = resumeInputRef.current.files[0];
            const data = await generateInterviewReport({selfDescription, jobDescription, resumeFile});

            if(data && data?.interviewReport && data?.interviewReport?._id){
                navigate(`/interview/${data.interviewReport._id}`);
                toast.success("Generated Interview Report Successfully");
                setLoading(false);
            } else {
                alert("Interview report generation failed");
                setLoading(false);
            }

        } catch(err){
            console.log("Error generating interview report (from Home) :", err);
            toast.error(
                err.response?.data?.message ||
                err.message ||
                "Something went wrong"
            );
            setLoading(false);
        }
    }

    if(loading){
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan....</h1>
            </main>
        )
    }

    return ( 
        <>
        <Header />
        <main className="home-container">
            <header className="home-header">
                <h1 className="title">
                    Create Your Custom <span className="highlight">Interview Plan</span>
                </h1>
                <p className="subtitle">
                    Let our AI analyze the job requirements and your unique profile to build a winning strategy.
                </p>
            </header>

            {/*Interview Card*/}
            <div className="interview-card">
                <div className="card-content">
                    {/* Left Column: Target Job Description */}
                    <section className="left-section">
                        <div className="section-header">
                            <div className="header-label">
                                <span className="icon">💼</span>
                                <label htmlFor="jobDescription">Target Job Description</label>
                            </div>
                            <span className="badge required">REQUIRED</span>
                        </div>
                        <div className="input-wrapper">
                            <textarea
                                onChange={(e)=>{setJobDescription(e.target.value)}}
                                id="jobDescription"
                                name="jobDescription"
                                placeholder="Paste the full job description here... e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                            ></textarea>
                            <div className="char-count">0 / 5000 chars</div>
                        </div>
                    </section>

                    {/* Right Column: Your Profile */}
                    <section className="right-section">
                        <div className="section-header">
                            <div className="header-label">
                                <span className="icon">👤</span>
                                <label>Your Profile</label>
                            </div>
                            <span className="badge success">BEST RESULTS</span>
                        </div>

                        <div className="upload-group">
                            <p className="label">Upload Resume</p>
                            <div className="upload-zone">
                                <input  
                                    ref={resumeInputRef} 
                                    hidden 
                                    type="file" 
                                    id="resume" 
                                    name="resume" 
                                    accept=".pdf" 
                                />
                                <label htmlFor="resume" className="upload-label">
                                    <div className="upload-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="17 8 12 3 7 8"></polyline>
                                            <line x1="12" y1="3" x2="12" y2="15"></line>
                                        </svg>
                                    </div>
                                    <p className="primary-text">Click to upload or drag & drop</p>
                                    <p className="secondary-text">PDF (MAX 3MB)</p>
                                </label>
                            </div>
                        </div>

                        <div className="divider">
                            <span>AND</span>
                        </div>

                        <div className="input-group">
                            <p className="label">Quick Self-Description</p>
                            <textarea
                                onChange={(e)=>{setSelfDescription(e.target.value)}}
                                id="selfDescription"
                                name="selfDescription"
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            ></textarea>
                        </div>

                        <div className="info-banner">
                            <span className="info-icon">ℹ</span>
                            <p> Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                    </section>
                </div>

                <footer className="card-footer">
                    <p className="status-text">AI-Powered Strategy Generation • Approx 30s</p>
                    <button 
                        onClick={handleGenerateReportSubmit}
                        className="generate-button">
                            <span className="star">★</span> Generate My Interview Strategy
                    </button>
                </footer>
            </div>

            {/* Recent Report List */}
            {reports && reports.length > 0 && (
                <section className="recent-reports">
                    <h2 className="section-title">Your Recent Interview Plans</h2>
                    <ul className="reports-list">
                        {reports.map(report =>(
                            <li key={report._id} className="report-item" onClick={()=>navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || "Untitled Position"}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >=80 ? 'score-high' : report.matchScore >= 60 ? 'score-mid' : 'score-low'}`}>
                                    Match Score: {report.matchScore}%
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}


            {/* Page Foooter */}
            <nav className="footer-links">
                <a href="#privacy">PRIVACY POLICY</a>
                <a href="#terms">TERMS OF SERVICE</a>
                <a href="#help">HELP CENTER</a>
            </nav>
        </main>
        </>
    );
}

export default Home;