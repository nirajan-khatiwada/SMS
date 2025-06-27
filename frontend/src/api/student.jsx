import axiosInstance from "./api";  

const getStudentProfile = async () => {
  const resp = await axiosInstance.get("/student/all-student-profile/");
  return resp.data;
}

export { getStudentProfile };