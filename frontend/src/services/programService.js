import api from "./api";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.programs)) return payload.programs;
  return [];
};

const normalizeItem = (payload) => payload?.data ?? payload;

export const getPrograms = async (params = {}) => {
  const response = await api.get("/programs", { params });
  return normalizeList(response.data ?? response);
};

export const getProgram = async (id) => {
  const response = await api.get(`/programs/${id}`);
  return normalizeItem(response.data ?? response);
};

export const getProgramById = async (id) => getProgram(id);

export const createProgram = async (payload) => {
  const response = await api.post("/programs", payload);
  return normalizeItem(response.data ?? response);
};

export const updateProgram = async (id, payload) => {
  const response = await api.put(`/programs/${id}`, payload);
  return normalizeItem(response.data ?? response);
};

export const deleteProgram = async (id) => {
  const response = await api.delete(`/programs/${id}`);
  return normalizeItem(response.data ?? response);
};

export const uploadProgramImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/uploads/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return normalizeItem(response.data ?? response);
};

const programService = {
  getPrograms,
  getProgram,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  uploadProgramImage,
};

export default programService;