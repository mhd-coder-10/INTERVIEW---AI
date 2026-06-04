import React, {useState} from 'react';
import {useNavigate, Link, useSubmit} from "react-router-dom";
import {useAuth} from "../hooks/useAuth.js";
import {toast} from "react-toastify";

const Register = () => {
    const navigate = useNavigate();
    const {loading, handleRegister} = useAuth();

    const [username, setUsername] = useState("");   
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            await handleRegister({username,email,password});
            toast.success("Regitered Successfully");
            navigate("/");
        } catch(err){
            toast.error(
                err.response?.data?.message || "Register Failed"
            )
        }
    }
    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">username</label>
                        <input 
                            onChange={(e)=>{setUsername(e.target.value)}}
                            type="text" name="username" id="username" placeholder="Enter username"/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            onChange={(e)=>{setEmail(e.target.value)}}
                            type="email" name="email" id="email" placeholder="Enter email address"/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            onChange={(e)=>{setPassword(e.target.value)}}
                            type="password" name="password" id="password" placeholder="Enter Password"/>
                    </div>

                    <button className='button primary-button'>Register</button>
                </form>
                <p>Allready have an account ? <Link to={"/login"}>Login</Link></p>
            </div>
        </main>
    )
}

export default Register
