import api from "./api";

export const getCustomerProfile = async (
  customerId
) => {
  const response = await api.get(
    `/customer-profile/${customerId}`
  );

  return response.data;
};