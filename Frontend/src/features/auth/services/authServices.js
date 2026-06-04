import axios from "axios"
import { redirect } from "react-router";

const api = axios.create({
    baseURL : "http://localhost:3000",
    withCredentials : true
});

export async function register({username, email, password}){
    try {
        const response = await api.post("/api/auth/register", {
            username, email, password
        })
        return response.data;
    } catch(e){
        console.log(e);
        throw e;
    }
}

export async function login({email, password}){
    try {
        const response = await api.post("/api/auth/login",{email, password})
        return response.data;
    } catch(e){
        console.log(e);
        throw e;
    }
}

export async function logout() {
    try {
        const response = await api.get("/api/auth/logout")
        return response.data;
    } catch(e){
        console.log(e);
        throw e;
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me");
        return response.data;
    } catch(e){
        if (e.response?.status === 401) {
            return null;
        }
        throw e;
    }
}