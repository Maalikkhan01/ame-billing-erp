import api from "./api";

// Create Bill
export const createBill = async (data) => {
  const response = await api.post("/bills", data);

  return response.data;
};

// Get All Bills
export const getBills = async (page = 1, keyword = "") => {
  const response = await api.get(`/bills?page=${page}&keyword=${keyword}`);

  return response.data;
};

// Get Single Bill
export const getBillById = async (id) => {
  const response = await api.get(`/bills/${id}`);

  return response.data;
};
