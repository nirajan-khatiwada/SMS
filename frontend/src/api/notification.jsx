import axiosInstance from "./api";
const fetchNotifications = async ()=>{
    const resp = await axiosInstance.get('/notification/');
    return resp.data;
}
export{fetchNotifications};