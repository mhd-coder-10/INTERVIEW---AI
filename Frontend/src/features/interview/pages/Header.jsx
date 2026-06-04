
import React from 'react';
import '../style/Header.scss';
import {Link, useNavigate} from "react-router";
import {useAuth} from "../../auth/hooks/useAuth"
import { toast } from 'react-toastify'
import {useInterview} from "../../interview/hooks/useInterview"

const Header = () => {
    const navigate = useNavigate();
    const {user, handleLogout} = useAuth();

    const handleLogoutClick = async ()=>{
        try {
            await handleLogout();
            toast.success("Loged out succesfully");
            navigate("/login");
        } catch(err){
            toast.error(
                err.response?.data?.message || "Logout Failed"
            )
        }
        
    }

    return (
        <nav className="main-header">
            <div className="header-container">
                <div className="logo-group">
                    <div className="logo-icon">★</div>
                    <span className="logo-text">Interview<span className="highlight">AI</span></span>
                </div>

                <div className="nav-actions">
                    {!user ? (
                        <> 
                            <Link className="auth-btn login" to="/login">Login</Link>
                            <Link className="cta-btn" to="/register">Get Started</Link>
                        </>
                    ) : (
                        <button 
                            onClick={handleLogoutClick}
                            className="auth-btn logout"
                        >
                            Logout
                        </button>
                    )}
                    
                </div>
            </div>
        </nav>
    );
};

export default Header;