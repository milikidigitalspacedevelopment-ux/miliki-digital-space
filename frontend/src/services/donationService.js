import api from "./api";

const donationService = {

  createDonation: async (
    data
  ) => {

    const response =
      await api.post(
        "/donations",
        data
      );

    return response.data;

  },

  getMyDonations: async () => {

    const response =
      await api.get(
        "/donations/my"
      );

    return response.data;

  },

  listDonations: async (params = {}) => {
    const response = await api.get("/donations", {
      params,
    });

    return response.data;
  },

  getReceipt: async (
    id
  ) => {

    const response =
      await api.get(
        `/donations/${id}/receipt`
      );

    return response.data;

  }

  ,

  exportDonations: async (params = {}) => {
    const response = await api.get("/donations/export", {
      params,
      responseType: "blob",
    });

    return response.data;
  }

};

export default donationService;