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

const getAllAssignments = async () => {
    const response = await axiosInstance.get(`/tms/assignments/`);
    return response.data;
}

const createAssignment = async (assignmentData) => {
    // For file uploads, we need to override the default content-type header
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };
    
    const response = await axiosInstance.post(`/tms/assignments/`, assignmentData, config);
    return response.data;
}

const updateAssignment = async (assignmentId, assignmentData) => {
    // For file uploads, we need to override the default content-type header
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };
    
    const response = await axiosInstance.put(`/tms/assignments/${assignmentId}/`, assignmentData, config);
    return response.data;
}

const deleteAssignment = async (assignmentId) => {
    const response = await axiosInstance.delete(`/tms/assignments/${assignmentId}/`);
    return response.data;
}


const getAllAssignmentSubmition = async (assignmentId) => {
    const response = await axiosInstance.get(`/tms/assignment-submissions/${assignmentId}/`);
    return response.data;
}

const updateAssignmentSubmission = async (submissionId, submissionData) => {
    const response = await axiosInstance.put(`/tms/assignment-submission/${submissionId}/`, submissionData);
    return response.data;
}

const assignmentSummary = async (className, section) => {
    const response = await axiosInstance.get(
      `/tms/assignment-submission-detail/?class_name=${className}&section=${section}`
    );
    return response.data;
}







export { 
    getAttandanceRecord, 
    createAttandanceRecord, 
    getAttendanceRecordByDateRange,
    getAllAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAllAssignmentSubmition,
    updateAssignmentSubmission,
    assignmentSummary
    
};
