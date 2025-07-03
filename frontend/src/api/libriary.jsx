import axiosInstance from "./api";

const getClasses = async () => {
  const resp = await axiosInstance.get("/lms/classes/");
  return resp.data;
};

const createClass = async (data) => {
  const resp = await axiosInstance.post("/lms/classes/", data);
  return resp.data;
};

const deleteClass = async (id) => {
  const resp = await axiosInstance.delete(`/lms/classes/${id}/`);
  return resp.data;
};

const updateClass = async (id, data) => {
  const resp = await axiosInstance.put(`/lms/classes/${id}/`, data);
  return resp.data;
};

const getSections = async () => {
  const resp = await axiosInstance.get("/lms/sections/");
  return resp.data;
};

const createSection = async (data) => {
  const resp = await axiosInstance.post("/lms/sections/", data);
  return resp.data;
};

const deleteSection = async (id) => {
  const resp = await axiosInstance.delete(`/lms/sections/${id}/`);
  return resp.data;
};
const updateSection = async (id, data) => {
  const resp = await axiosInstance.put(`/lms/sections/${id}/`, data);
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

const bookReturn = async (data) => {
  const resp = await axiosInstance.post("/lms/book-return/", data);
  return resp.data;
};

const getBookIssue = async () => {
  const resp = await axiosInstance.get("/lms/book-issues/");
  return resp.data;
};

const getBookReturn = async () => {
  const resp = await axiosInstance.get("/lms/book-return/");
  return resp.data;
}

export {
  getBookReturn,
  getBookIssue,
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
    bookIssue,
    bookReturn
};
