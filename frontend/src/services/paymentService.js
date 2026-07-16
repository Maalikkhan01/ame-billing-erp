import api from "./api";

export const receivePayment = async ({
  customerId,
  amount,
  paymentMode,
  note,
}) => {
  const response = await api.post("/payments/receive", {
    customerId,
    amount,
    paymentMode,
    note,
  });

  return response.data;
};
