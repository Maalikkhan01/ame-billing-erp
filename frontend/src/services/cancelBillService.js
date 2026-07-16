import api from "./api";

export const cancelBill = async ({ billId, reason }) => {
  const response = await api.post("/cancel-bill", {
    billId,
    reason,
  });

  return response.data;
};
