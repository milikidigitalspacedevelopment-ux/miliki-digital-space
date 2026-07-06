import api from "./api";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.donors)) return payload.donors;
  return [];
};

const normalizeItem = (payload) => payload?.data ?? payload;

export const getDonors = async (params = {}) => {
  const response = await api.get("/donors", { params });
  return normalizeList(response.data ?? response);
};

export const getDonor = async (id) => {
  const response = await api.get(`/donors/${id}`);
  return normalizeItem(response.data ?? response);
};

export const createDonor = async (payload) => {
  const response = await api.post("/donors", payload);
  return normalizeItem(response.data ?? response);
};

export const updateDonor = async (id, payload) => {
  const response = await api.put(`/donors/${id}`, payload);
  return normalizeItem(response.data ?? response);
};

export const deleteDonor = async (id) => {
  const response = await api.delete(`/donors/${id}`);
  return normalizeItem(response.data ?? response);
};

export const uploadDonorAvatar = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/uploads/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return normalizeItem(response.data ?? response);
};

const donorService = {
  getDonors,
  getDonor,
  createDonor,
  updateDonor,
  deleteDonor,
  uploadDonorAvatar,
};

export default donorService;
