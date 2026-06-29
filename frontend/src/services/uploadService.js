import api from "./api";

const uploadService = {
  uploadImage: async (formData) => {
    const response = await api.post(
      "/uploads/image",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  uploadFile: async (formData) => {
    const response = await api.post(
      "/uploads/file",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};

export default uploadService;