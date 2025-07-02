import axiosInstance from "./api";

const getProducts = async () => {
    const response = await axiosInstance.get("/nurse/product/");
    return response.data;
}

const updateProduct = async (id ,data)=>{
    const response = await axiosInstance.put(`/nurse/product/${id}/`, data);
    return response.data;
}

const postProduct = async (data) => {
    const response = await axiosInstance.post("/nurse/product/", data);
    return response.data;
}

const deleteProduct = async (id) => {
    const response = await axiosInstance.delete(`/nurse/product/${id}/`);
    return response.data;
}

export {getProducts, updateProduct, postProduct, deleteProduct};