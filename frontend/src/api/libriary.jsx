import axiosInstance from "./api";

const getClasses = async () => {
  const resp = await axiosInstance.get("/student/classes/");
  return resp.data;
};

const createClass = async (data) => {
  const resp = await axiosInstance.post("/student/classes/", data);
  return resp.data;
};

const deleteClass = async (id) => {
  const resp = await axiosInstance.delete(`/student/classes/${id}/`);
  return resp.data;
};

const updateClass = async (id, data) => {
  const resp = await axiosInstance.put(`/student/classes/${id}/`, data);
  return resp.data;
};

const getSections = async () => {
  const resp = await axiosInstance.get("/student/sections/");
  return resp.data;
};

const createSection = async (data) => {
  const resp = await axiosInstance.post("/student/sections/", data);
  return resp.data;
};

const deleteSection = async (id) => {
  const resp = await axiosInstance.delete(`/student/sections/${id}/`);
  return resp.data;
};
const updateSection = async (id, data) => {
  const resp = await axiosInstance.put(`/student/sections/${id}/`, data);
  return resp.data;
};

const postBook = async (data) => {
  const resp = await axiosInstance.post("/lms/books/", data);
  return resp.data;
};

const getAllBooks = async () => {
  const resp = await axiosInstance.get("/lms/books/");
  return resp.data;
};

const deleteBook = async (id) => {
  const resp = await axiosInstance.delete(`/lms/books/${id}/`);
  return resp.data;
};

const updateBook = async (id, data) => {
  const resp = await axiosInstance.patch(`/lms/books/${id}/`, data);
  return resp.data;
};

const bookIssue = async (data) => {
  const resp = await axiosInstance.post("/lms/book-issues/", data);
  return resp.data;
};

export {
  getClasses,
  createClass,
  deleteClass,
  updateClass,
  getSections,
  createSection,
  deleteSection,
  updateSection,
  postBook,
  updateBook,
  deleteBook,
    getAllBooks,
    bookIssue
};
