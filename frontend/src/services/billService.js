import api from "./api";

export const getBills = async (page = 1, keyword = "") => {
  const response = await api.get(
    `/bills?page=${page}&keyword=${encodeURIComponent(keyword)}`,
  );

  return response.data;
};

export const getBillById = async (id) => {
  const response = await api.get(`/bills/${id}`);

  return response.data.bill;
};
