import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext.jsx";
import {login, register, logout, getMe} from "../services/authServices.js"


export const useAuth = ()=>{
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    const {user, setUser, loading, setLoading} = context;

    const handleRegister = async ({username, email, password}) =>{
        setLoading(true);
        try {
            const data = await register({username, email, password});
            setUser(data.user);
        } catch(e){
            console.log(e);
            throw e;
        } finally{
            setLoading(false);
        }
    }

    const handleLogin = async ({email, password})=>{
        setLoading(true);
        try {
            const data = await login({email, password});
            setUser(data.user);
        } catch(e){
            console.log(e);
            throw e;
        } finally {
            setLoading(false);
        }
    }   

    const handleLogout = async()=>{
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch(e) {
            console.log(e);
            throw e;
        } finally {
            setLoading(false);
        }
    }

    const handleGetMe = async ()=>{
        setLoading(true);
        try {
            const data = await getMe(); 

            if(data?.user){
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch(e){
            console.log(e);
            setUser(null);
            throw e;
        } finally {
            setLoading(false);
        }
    }

    return {
        user, 
        loading,
        handleRegister,
        handleLogin,
        handleLogout,
        handleGetMe
    }

}

