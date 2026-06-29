import api from "./api";

const userService = {

  getProfile: async () => {

    const response =
      await api.get("/users/profile");

    return response.data?.user ?? response.data;

  },

  updateProfile: async (
    data
  ) => {

    const response =
      await api.put(
        "/users/profile",
        data
      );

    return response.data?.user ?? response.data;

  },

  uploadAvatar: async (
    formData
  ) => {

    const response =
      await api.post(
        "/users/avatar",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

    return response.data;

  }

};

export default userService;