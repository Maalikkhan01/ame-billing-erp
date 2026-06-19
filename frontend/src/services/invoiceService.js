import api from "./api";

export const getInvoiceById = async (id) => {
  const response = await api.get(`/bills/${id}`);

  return response.data;
};