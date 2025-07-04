import axiosInstance from "./api";

const getAttandanceRecord = async (className, section, date) => {
  
    const response = await axiosInstance.get(
      `/tms/attandance/?class_name=${className}&section=${section}&date=${date}`
    );
    return response.data;
  
}

const createAttandanceRecord = async (attendanceData) => {
    const response = await axiosInstance.post(
      `/tms/attandance/`,
      attendanceData
    );
    return response.data;
}

const getAttendanceRecordByDateRange = async (fromDate, toDate, className, section) => {
    const response = await axiosInstance.get(
      `/tms/student-attandance-history/?from_date=${fromDate}&to_date=${toDate}&class_name=${className}&section=${section}`
    );
    return response.data;
}

export { getAttandanceRecord, createAttandanceRecord,getAttendanceRecordByDateRange };
