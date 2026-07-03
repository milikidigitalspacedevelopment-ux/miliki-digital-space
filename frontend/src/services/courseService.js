import api from "./api";

const courseService = {
  getAllCourses: async (params = {}) => {
    const response = await api.get("/courses", { params });
    return response.data;
  },

  getCourses: async (params = {}) => courseService.getAllCourses(params),

  getMyCourses: async (params = {}) => courseService.getAllCourses(params),

  getTrainerCourses: async (params = {}) => courseService.getAllCourses(params),

  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  enrollCourse: async (id) => {
    const response = await api.post(`/courses/${id}/enroll`);
    return response.data;
  },
};

export default courseService;