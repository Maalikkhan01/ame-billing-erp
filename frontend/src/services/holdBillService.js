import api from "./api";

export const createHoldBill = async (data) => {
  const response = await api.post("/hold-bills", data);

  return response.data;
};

export const getHoldBills = async () => {
  const response = await api.get("/hold-bills");

  return response.data;
};

export const deleteHoldBill = async (id) => {
  const response = await api.delete(`/hold-bills/${id}`);

  return response.data;
};

export const updateHoldBill = async (holdBillId, payload) => {
  const response = await api.put(`/hold-bills/${holdBillId}`, payload);

  return response.data;
};
