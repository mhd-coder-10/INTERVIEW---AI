import React, {useState} from 'react'
import {Link, useNavigate, Navigate} from "react-router-dom"
import "../AuthForm.scss"
import {useAuth} from "../hooks/useAuth.js"
import {toast} from "react-toastify"

const Login = () => {

    const {user, loading, handleLogin} = useAuth();
    const navigate =  useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await handleLogin({ email, password });
        toast.success("Login Successfully");
        navigate("/");
    } catch (err) {
        toast.error(
            err.response?.data?.message ||
            "Login Failed"
        );
    }
};

    if(loading) return <main><h1>Loading.....</h1></main>

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            value={email}
                            onChange = {(e)=>{setEmail(e.target.value)}}
                            type="email" name="email" id="email" placeholder="Enter email address"/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            value={password}
                            onChange={(e)=>{ setPassword(e.target.value)}}
                            type="password" name="password" id="password" placeholder="Enter Password"/>
                    </div>

                    <button className='button primary-button'>Login</button>
                </form>

                <p>Don't have an account ? <Link to="/register">Register</Link></p>
            </div>
        </main>
    )
}

export default Login
