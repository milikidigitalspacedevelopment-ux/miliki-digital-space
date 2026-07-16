import api from "./api";

const galleryService = {
  listImages: async () => {
    const response = await api.get("/gallery");
    return response.data;
  },
  createImage: async (payload) => {
    const response = await api.post("/gallery", payload);
    return response.data;
  },
  deleteImage: async (id) => {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  },
};

export default galleryService;
