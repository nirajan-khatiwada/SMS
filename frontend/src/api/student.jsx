import axiosInstance from "./api";  

const getStudentProfile = async () => {
  const resp = await axiosInstance.get("/student/all-student-profile/");
  return resp.data;
}

const getStudentPhoneNumber = async () => {
  const resp = await axiosInstance.get(`/student/student-phone-number/`);
  return resp.data;
}

const getAllStudentClasses = async () => {
  const resp = await axiosInstance.get(`/student/classes/`);
  return resp.data;
}

const getAllStudentSections = async () => {
  const resp = await axiosInstance.get(`/student/sections/`);
  return resp.data;
}


const getAllAssignmentDetails=async (id)=>{
  const resp = await axiosInstance.get(`/tms/assignment-submission/${id}/`);
  return resp.data;
}

const postAssignmentDetails=async (data)=>{
  const resp = await axiosInstance.post(`/tms/assignment-submission/`,data);
  return resp.data;
}

const updateAssignmentDetails=async (id,data)=>{
  const resp = await axiosInstance.put(`/tms/assignment-submission/${id}/`,data);
  return resp.data;
}


export { getStudentProfile,getStudentPhoneNumber,getAllStudentClasses,getAllStudentSections,getAllAssignmentDetails,postAssignmentDetails,updateAssignmentDetails };