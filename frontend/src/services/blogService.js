import api from "./api";

const blogService = {

  // list blogs with optional params { q, category, status, featured, page, perPage }
  listBlogs: async (params = {}) => {
    const response = await api.get("/blogs", { params });
    return response.data;
  },

  getBlogs: async (params = {}) => {
    const response = await api.get("/blogs", { params });
    return response.data;
  },

  getBlogBySlug: async (slug) => {
    const response = await api.get(`/blogs/${slug}`);
    return response.data;
  },

  getBlog: async (id) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  getBlogById: async (id) => blogService.getBlog(id),

  trackView: async (id) => {
    const response = await api.post(`/blogs/${id}/track-view`);
    return response.data;
  },

  trackShare: async (id) => {
    const response = await api.post(`/blogs/${id}/track-share`);
    return response.data;
  },

  trackTimeSpent: async (id, seconds) => {
    const response = await api.post(`/blogs/${id}/track-time`, { seconds });
    return response.data;
  },

  createBlog: async (payload) => {
    const response = await api.post(`/blogs`, payload);
    return response.data;
  },

  updateBlog: async (id, payload) => {
    const response = await api.put(`/blogs/${id}`, payload);
    return response.data;
  },

  deleteBlog: async (id) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  }

};

export default blogService;