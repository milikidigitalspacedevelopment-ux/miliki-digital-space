import api from "./api";

const courseService = {

  getAllCourses: async () => {

    const response =
      await api.get("/courses");

    return response.data;

  },

  getCourseById: async (
    id
  ) => {

    const response =
      await api.get(
        `/courses/${id}`
      );

    return response.data;

  },

  enrollCourse: async (
    id
  ) => {

    const response =
      await api.post(
        `/courses/${id}/enroll`
      );

    return response.data;

  }

};

export default courseService;