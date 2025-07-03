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

export { getStudentProfile,getStudentPhoneNumber,getAllStudentClasses,getAllStudentSections };