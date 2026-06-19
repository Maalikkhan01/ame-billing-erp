import api from "./api";

export const receivePayment = async (data) => {
  const response = await api.post(
    "/payments/receive",
    data
  );

  return response.data;
};