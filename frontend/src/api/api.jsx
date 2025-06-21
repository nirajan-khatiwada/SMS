import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

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

const fetchUser = async ()=>{
    const resp = await axiosInstance.get('/user/');
    return resp.data;
}

const updateEmailAndFn = async (data)=>{
    const resp = await axiosInstance.put('/user/', data);
    return resp.data;
}

const changePassword = async (data)=>{
    const resp = await axiosInstance.post('/user/change-password/', data);
    return resp.data;
}


export {contactForm,logout,login,fetchUser,updateEmailAndFn,changePassword}
export default axiosInstance;