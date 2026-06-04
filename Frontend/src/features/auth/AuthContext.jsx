import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/authServices";

export const AuthContext = createContext();

export function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // user access login page untill he is not logout 
    useEffect(()=>{
        const getAndSetUser = async ()=>{
            try {
                const data = await getMe();
                if(data?.user){
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (e){
                console.log("GET ME ERROR:",e);
                setUser(null);
                throw e;
            } finally{
                setLoading(false);
            }      
        }
        getAndSetUser();
    }, []);


    return (
        <AuthContext.Provider value={{user, setUser, loading, setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}
