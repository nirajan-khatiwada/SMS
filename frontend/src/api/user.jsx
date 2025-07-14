
import axiosInstance from "./api";
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

export {fetchUser, updateEmailAndFn, changePassword};