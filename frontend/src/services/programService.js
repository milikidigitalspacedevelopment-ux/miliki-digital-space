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

const programService = {
  getPrograms,
  getProgram,
  getProgramById,
};

export default programService;