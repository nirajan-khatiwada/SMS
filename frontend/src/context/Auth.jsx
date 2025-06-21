import { createContext,useState,useEffect } from "react";
import { Outlet,useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import axiosInstance,{logout,login} from "./../api/api" 
import axios from "axios";


const AuthContext = createContext();


export const AuthProvider = ()=>{
    const navigate = useNavigate();
    const [user,setUser] = useState(()=>{
        const refresh_token = localStorage.getItem("refresh_token");
        if(refresh_token){
            const decoded = jwtDecode(refresh_token);
            if(decoded.exp * 1000 < Date.now()){
                localStorage.removeItem("refresh_token");
                navigate("/login");
                return null;
            }
            return decoded;
        }
    })

    const Logout = async ()=>{
        const refresh_token = localStorage.getItem("refresh_token");
        if(refresh_token){
            await logout(refresh_token);
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("access_token");
            setUser(null);
            navigate("/login");
        }
    }

    const Login = async (data)=>{
        
        const {access,refresh} = await login(data);
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        setUser(jwtDecode(refresh));
        navigate(`/${jwtDecode(refresh).role}`);
        
    }

    useEffect(()=>{
        

        axiosInstance.interceptors.response.use((res)=>res,async (err)=>{
            const originalRequest = err.config;
            if(err.response.status === 401 && !originalRequest._retry){
                originalRequest._retry = true;

                    const refresh_token = localStorage.getItem("refresh_token");
                    if(!refresh_token){
                        localStorage.removeItem("refresh_token");
                        localStorage.removeItem("access_token");
                        setUser(null);
                        navigate("/login");
                        return Promise.reject(err);
                    }
                    try{
                        
                        const data = await axios.post("http://localhost:8000/auth/token/refresh/ ",{refresh: refresh_token});
        
                        localStorage.setItem("access_token", data.data.access);
                        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.data.access}`;
                        return axiosInstance(originalRequest);
                    }catch(error){
                        localStorage.removeItem("refresh_token");
                        localStorage.removeItem("access_token");
                        setUser(null);
                        navigate("/login");
                    }
                
            }
            return Promise.reject(err);
        })
    },[])

    return <AuthContext.Provider value={{Login,Logout,user,isAuthenticated: !!user}}>
        {<Outlet/>}
    </AuthContext.Provider>

}

export default AuthContext;