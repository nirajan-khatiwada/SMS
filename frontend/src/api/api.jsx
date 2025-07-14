import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_BASE_URL

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((req)=>{
            const access_token = localStorage.getItem("access_token");
            if(access_token){
                req.headers.Authorization = `Bearer ${access_token}`;
            }
            return req;
        },async (err)=>Promise.reject(err))

const contactForm =async  (data)=>{
    const resp = await axiosInstance.post('/contact/', data);
    return resp.data;
}


const logout = async (refresh)=>{
    await axiosInstance.post('auth/token/blacklist/', {refresh});
}

const login = async (data)=>{
    const resp = await axiosInstance.post('/auth/login/', data);
    const {access, refresh} = resp.data;
    return {access, refresh};

}
export {contactForm,logout,login}
export default axiosInstance;