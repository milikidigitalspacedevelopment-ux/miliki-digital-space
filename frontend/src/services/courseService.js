import api from "./api";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.courses)) return payload.courses;
  return [];
};

const normalizeItem = (payload) => payload?.data ?? payload;

export const getCourses = async (params = {}) => {
  const response = await api.get("/courses", { params });
  return normalizeList(response.data ?? response);
};

export const getAllCourses = async (params = {}) => getCourses(params);
export const getMyCourses = async (params = {}) => getCourses(params);
export const getTrainerCourses = async (params = {}) => getCourses(params);

export const getCourseById = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return normalizeItem(response.data ?? response);
};

export const createCourse = async (payload) => {
  const response = await api.post("/courses", payload);
  return normalizeItem(response.data ?? response);
};

export const updateCourse = async (id, payload) => {
  const response = await api.put(`/courses/${id}`, payload);
  return normalizeItem(response.data ?? response);
};

export const deleteCourse = async (id) => {
  const response = await api.delete(`/courses/${id}`);
  return normalizeItem(response.data ?? response);
};

export const uploadCourseImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/uploads/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return normalizeItem(response.data ?? response);
};

export const enrollCourse = async (id) => {
  const response = await api.post(`/courses/${id}/enroll`);
  return response.data;
};

export const getCourseEnrollmentStatus = async (id) => {
  const response = await api.get(`/courses/${id}/enrollment`);
  return response.data?.enrolled ?? false;
};

export const trackPopularity = async (id) => {
  try {
    const response = await api.post(`/courses/${id}/track-popularity`);
    return response.data;
  } catch (err) {
    // don't block UI if tracking fails
    return null;
  }
};

export const addCourseRequirement = async (courseId, payload) => {
  const response = await api.post(`/courses/${courseId}/requirements`, payload);
  return normalizeItem(response.data ?? response);
};

export const updateCourseRequirement = async (courseId, requirementId, content) => {
  const response = await api.put(`/courses/${courseId}/requirements/${requirementId}`, {
    type: "requirement",
    content,
  });
  return normalizeItem(response.data ?? response);
};

export const deleteCourseRequirement = async (courseId, requirementId) => {
  const response = await api.delete(`/courses/${courseId}/requirements/${requirementId}`);
  return normalizeItem(response.data ?? response);
};

export const reorderCourseRequirements = async (courseId, requirements) => {
  const response = await api.post(`/courses/${courseId}/requirements/reorder`, { requirements });
  return normalizeItem(response.data ?? response);
};

const courseService = {
  getAllCourses,
  getCourses,
  getMyCourses,
  getTrainerCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  uploadCourseImage,
  enrollCourse,
  trackPopularity,
  addCourseRequirement,
  updateCourseRequirement,
  deleteCourseRequirement,
  reorderCourseRequirements,
};

export default courseService;